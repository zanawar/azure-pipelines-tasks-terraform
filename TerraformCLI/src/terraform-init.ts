import { IExecOptions, ToolRunner } from "azure-pipelines-task-lib/toolrunner";
import tasks = require("azure-pipelines-task-lib/task");
import { IHandleCommand, TerraformCommand, TYPES, ITerraformProvider } from "./terraform";
import { injectable, inject } from "inversify";

export enum BackendTypes{
    azurerm = "azurerm"
}

export class TerraformInit extends TerraformCommand{
    readonly backendType: BackendTypes | undefined;

    constructor(
        name: string, 
        workingDirectory: string,
        backendType: string) {
        super(name, workingDirectory);
        if(backendType){
            this.backendType = BackendTypes[<keyof typeof BackendTypes> backendType];                
        }
    }
}

@injectable()
export class TerraformInitHandler implements IHandleCommand{
    private readonly terraformProvider: ITerraformProvider;

    constructor(
        @inject(TYPES.ITerraformProvider) terraformProvider: ITerraformProvider
    ) {
        this.terraformProvider = terraformProvider;        
    }

    public async execute(command: string): Promise<number> {
        let init = new TerraformInit(
            command,
            tasks.getInput("workingDirectory"),
            tasks.getInput("backendType")
        );
        return this.onExecute(init);
    }

    private async onExecute(command: TerraformInit): Promise<number> {
        var terraform = this.terraformProvider.create();
        terraform.arg(command.name);
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

            let backendConfig: any = {
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
        }
    }
}