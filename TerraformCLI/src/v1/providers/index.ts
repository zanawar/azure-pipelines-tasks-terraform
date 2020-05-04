export interface ITerraformProvider{
    init(): Promise<void>;
}

export { default as AzureRmProvider, AzureRMProviderConfiguration } from './azurerm'