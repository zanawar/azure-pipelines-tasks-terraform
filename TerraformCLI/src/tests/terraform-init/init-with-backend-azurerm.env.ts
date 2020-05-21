const backendServiceName: string = "backend";
const backendStorageAccountName: string = "storage";
const backendContainerName: string = "container";
const backendKey: string = "storageKey123";
const backendResourceGroupName: string = "rg-backend-storage";
let subscriptionId: string = "sub1";
let tenantId: string = "ten1";
let servicePrincipalId: string = "servicePrincipal1";
let servicePrincipalKey: string = "servicePrincipalKey123";

let terraformCommand: string = 'init';
let commandArgs: string = `-backend-config=storage_account_name=${backendStorageAccountName} -backend-config=container_name=${backendContainerName} -backend-config=key=${backendKey} -backend-config=resource_group_name=${backendResourceGroupName} -backend-config=arm_subscription_id=${subscriptionId} -backend-config=arm_tenant_id=${tenantId} -backend-config=arm_client_id=${servicePrincipalId} -backend-config=arm_client_secret=${servicePrincipalKey}`
let expectedCommand: string = `${terraformCommand} ${commandArgs}`

export let env: any = {
    taskScenarioPath:           require.resolve('./init-with-backend-azurerm'),
    terraformCommand:           terraformCommand,
    commandArgs:                commandArgs,
    subscriptionId:             subscriptionId,
    tenantId:                   tenantId,
    servicePrincipalId:         servicePrincipalId,
    servicePrincipalKey:        servicePrincipalKey,
    backendServiceName:         backendServiceName,
    backendStorageAccountName:  backendStorageAccountName,
    backendContainerName:       backendContainerName,
    backendKey:                 backendKey,
    backendResourceGroupName:   backendResourceGroupName,
    expectedCommand:            expectedCommand
}