import { ITerraformBackend, TerraformBackendInitResult } from ".";
import { CommandPipeline } from "../commands";
import { IRunner } from "../runners";
import { ITaskContext } from "../context";

export default class AzureRMBackend implements ITerraformBackend {
    constructor(
        private readonly runner: IRunner
    ) { }

    async init(ctx: ITaskContext): Promise<TerraformBackendInitResult> {
        if (ctx.backendServiceArmAuthorizationScheme != "ServicePrincipal") {
            throw "Terraform backend initialization for AzureRM only support service principal authorization";
        }

        let backendConfig: any = {
            storage_account_name: ctx.backendAzureRmStorageAccountName,
            container_name: ctx.backendAzureRmContainerName,
            key: ctx.backendAzureRmKey,
            resource_group_name: ctx.backendAzureRmResourceGroupName,
            arm_subscription_id: ctx.backendServiceArmSubscriptionId,
            arm_tenant_id: ctx.backendServiceArmTenantId,
            arm_client_id: ctx.backendServiceArmClientId,
            arm_client_secret: ctx.backendServiceArmClientSecret,
        }

        const result = <TerraformBackendInitResult>{
            args: []
        };

        for (var config in backendConfig) {
            result.args.push(`-backend-config=${config}=${backendConfig[config]}`);
        }

        if (ctx.ensureBackend === true) {
            this.ensureBackend(ctx);
        }

        return result;
    }

    private async ensureBackend(ctx: ITaskContext) {
        await new CommandPipeline(this.runner)
            .azLogin()
            .exec(ctx);
        // let shell = new CommandPipeline()
        //     .azLogin(new AzLogin(
        //         this.config.tenantId,
        //         this.config.clientId,
        //         this.config.clientSecret
        //     ))
        //     .azAccountSet(new AzAccountSet(
        //         this.config.subscriptionId
        //     ))
        //     .azGroupCreate(new AzGroupCreate(
        //         this.config.resourceGroupName,
        //         this.config.resourceGroupLocation
        //     ))
        //     .azStorageAccountCreate(new AzStorageAccountCreate(
        //         this.config.storageAccountName,
        //         this.config.resourceGroupName,
        //         this.config.storageAccountSku
        //     ))
        //     .azStorageContainerCreate(new AzStorageContainerCreate(
        //         this.config.containerName,
        //         this.config.storageAccountName
        //     ))
        //     .execute(this.mediator);
    }
}