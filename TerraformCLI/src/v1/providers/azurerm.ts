import { ITerraformProvider } from ".";

export interface AzureRMProviderConfiguration{
    scheme: string;
    subscriptionId: string;
    tenantId: string;
    clientId: string;
    clientSecret: string;
}

export default class AzureRMProvider implements ITerraformProvider {
    config: AzureRMProviderConfiguration;
    constructor(config: AzureRMProviderConfiguration){
        this.config = config;
    }

    async init(): Promise<void> {
        if(this.config.scheme != "ServicePrincipal"){
            throw "Terraform only supports service principal authorization for azure";
        }

        process.env['ARM_SUBSCRIPTION_ID']  = this.config.subscriptionId;
        process.env['ARM_TENANT_ID']        = this.config.tenantId;
        process.env['ARM_CLIENT_ID']        = this.config.clientId;
        process.env['ARM_CLIENT_SECRET']    = this.config.clientSecret;
    }
}