import { IExecOptions, ToolRunner } from "azure-pipelines-task-lib/toolrunner";
import tasks = require("azure-pipelines-task-lib/task");
import { IHandleCommand, TerraformCommand, TYPES, ITerraformProvider } from "./terraform";
import { injectable, inject } from "inversify";
import { AzureMediator, IAzureMediator } from "./azcli/mediator";
import { AzureShell } from "./azcli/azure-shell";
import { Login } from "./azcli/commands/login";
import { SetAccount } from "./azcli/commands/account-set";

export enum BackendTypes{
    azurerm = "azurerm"
}

export interface AzureBackendConfig {
    storage_account_name    : string,
    container_name          : string,
    key                     : string,
    resource_group_name     : string,
    arm_subscription_id     : string,
    arm_tenant_id           : string,
    arm_client_id           : string,
    arm_client_secret       : string    
}

export class TerraformInit extends TerraformCommand{
    readonly backendType: BackendTypes | undefined;

    constructor(
        name: string, 
        workingDirectory: string,
        backendType: string,
        options?: string | undefined) {
        super(name, workingDirectory, options);
        if(backendType){
            this.backendType = BackendTypes[<keyof typeof BackendTypes> backendType];                
        }
    }
}

@injectable()
export class TerraformInitHandler implements IHandleCommand{
    private readonly terraformProvider: ITerraformProvider;
    private readonly mediator: IAzureMediator;

    constructor(
        @inject(TYPES.ITerraformProvider) terraformProvider: ITerraformProvider,
        @inject(AzureMediator) mediator: IAzureMediator
    ) {
        this.terraformProvider = terraformProvider;        
        this.mediator = mediator
    }

    public async execute(command: string): Promise<number> {
        let init = new TerraformInit(
            command,            
            tasks.getInput("workingDirectory"),
            tasks.getInput("backendType"),
            tasks.getInput("commandOptions"),
        );
        return this.onExecute(init);
    }

    private async onExecute(command: TerraformInit): Promise<number> {
        var terraform = this.terraformProvider.create(command);
        this.setupBackendConfig(command, terraform);
        return terraform.exec(<IExecOptions>{
            cwd: command.workingDirectory
        });
    }

    private setupBackendConfig(command: TerraformInit, terraform: ToolRunner){
        if(command.backendType && command.backendType == BackendTypes.azurerm){
            let backendServiceName = tasks.getInput("backendServiceArm", true);
            let scheme = tasks.getEndpointAuthorizationScheme(backendServiceName, true);
            if(scheme != "ServicePrincipal"){
                throw "Terraform backend initialization for AzureRM only support service principal authorization";
            }

            let backendConfig: AzureBackendConfig | any = {
                storage_account_name    : tasks.getInput("backendAzureRmStorageAccountName", true),
                container_name          : tasks.getInput("backendAzureRmContainerName", true),
                key                     : tasks.getInput("backendAzureRmKey", true),
                resource_group_name     : tasks.getInput("backendAzureRmResourceGroupName", true),
                arm_subscription_id     : tasks.getEndpointDataParameter(backendServiceName, "subscriptionid", true),
                arm_tenant_id           : tasks.getEndpointAuthorizationParameter(backendServiceName, "tenantid", true),
                arm_client_id           : tasks.getEndpointAuthorizationParameter(backendServiceName, "serviceprincipalid", true),
                arm_client_secret       : tasks.getEndpointAuthorizationParameter(backendServiceName, "serviceprincipalkey", true)
            }

            for(var config in backendConfig){
                terraform.arg(`-backend-config=${config}=${backendConfig[config]}`);
            }

            let ensureBackendChecked: boolean = tasks.getBoolInput("ensureBackend");
            if(ensureBackendChecked === true){
                let location = tasks.getInput("backendAzureRmResourceGroupLocation", true);
                let sku = tasks.getInput("backendAzureRmStorageAccountSku", true);
                this.ensureBackend(backendConfig, location, sku);
            }
        }
    }

    private ensureBackend(backendConfig: AzureBackendConfig, location: string, sku: string){
        let shell = new AzureShell()
            .azLogin(new Login(
                backendConfig.arm_tenant_id,
                backendConfig.arm_client_id,
                backendConfig.arm_client_secret
            ))
            .azAccountSet(new SetAccount(
                backendConfig.arm_subscription_id
            ))
            .execute(this.mediator);
        /*
        new args needed...
        location: the region to which the resource group should be deployed
        sku: storage account sku, default to Standard_LRS
        */
        // var cli = new azcli(<IAzOptions>{ minVersion: '2.0.0' })
        //     .login(backendConfig.arm_tenant_id, backendConfig.arm_client_id, backendConfig.arm_client_secret)
        //     .setSubscription(backendConfig.arm_subscription_id);
        
        // await this.ensureBackendResourceGroup(cli, backendConfig.resource_group_name, location);
        // await this.ensureBackendStorageAccount(cli, backendConfig.resource_group_name, backendConfig.storage_account_name, sku);
        // await this.ensureBackendContainer(cli, backendConfig.resource_group_name, backendConfig.storage_account_name, backendConfig.container_name);
    }

    // private async ensureBackendResourceGroup(cli: azcli, resourceGroupName: string, location: string): Promise<any> {
    //     return await cli.start()
    //         .arg("group")
    //         .arg("create")
    //         .arg("--name")
    //         .arg(resourceGroupName)
    //         .arg("--location")
    //         .arg(location)
    //         .execJsonAsync<any>()
    //         .then((response) => {
    //             tasks.debug(`ensure backend: ensured resource group '${response.name}' at '${response.location}' with uri '${response.id}'`)
    //             return response;
    //         });        
    // }
    // private async ensureBackendStorageAccount(cli: azcli, resourceGroupName: string, storageAccountName: string, sku: string): Promise<any> {
    //     return await cli.start()
    //         .arg("storage")
    //         .arg("account")
    //         .arg("create")
    //         .arg("--name")
    //         .arg(storageAccountName)
    //         .arg("--resource-group")
    //         .arg(resourceGroupName)
    //         .arg("--sku")
    //         .arg(sku)
    //         .arg("--kind")
    //         .arg("BlobStorage")
    //         .arg("--encryption-services")
    //         .arg("blob")
    //         .arg("--access-tier")
    //         .arg("Hot")
    //         .execJsonAsync<any>()
    //         .then((response) => {
    //             tasks.debug(`ensure backend: ensured storage account '${response.name}' at '${response.location}' with uri '${response.id}'`)
    //             return response;
    //         });
    // }
    // private async ensureBackendContainer(cli: azcli, resourceGroupName: string, storageAccountName: string, containerName: string): Promise<any> {
    //     var primaryKey = await cli.start()
    //         .arg("storage")
    //         .arg("account")
    //         .arg("keys")
    //         .arg("list")
    //         .arg("--account-name")
    //         .arg(storageAccountName)
    //         .arg("--resource-group")
    //         .arg(resourceGroupName)
    //         .arg("--query")
    //         .arg("[0].value")
    //         .execRawStringAsync();            
    //     return await cli.start()
    //         .arg("storage")
    //         .arg("container")
    //         .arg("create")
    //         .arg("--name")
    //         .arg(containerName)
    //         .arg("--account-name ")
    //         .arg(storageAccountName)
    //         .arg("--account-key ")
    //         .arg(primaryKey)
    //         .execJsonAsync<any>()
    //         .then((response) => {
    //             tasks.debug(`ensure backend: ensured container '${containerName}'`)
    //             return response;
    //         });
    // }
}