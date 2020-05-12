let environmentServiceName = "dev";
let subscriptionId: string = "sub1";
let tenantId: string = "ten1";
let servicePrincipalId: string = "servicePrincipal1";
let servicePrincipalKey: string = "servicePrincipalKey123";

let expectedEnv: { [key: string]: string } = {
    'ARM_SUBSCRIPTION_ID': subscriptionId,
    'ARM_TENANT_ID': tenantId,
    'ARM_CLIENT_ID': servicePrincipalId,
    'ARM_CLIENT_SECRET': servicePrincipalKey,
}

const terraformCommand: string = "import";
const resourceAddress = "azurerm_resource_group.rg"
const resourceId = "/subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus"
const commandOptions:string = "-input=false"
const expectedArgs = `${commandOptions} ${resourceAddress} ${resourceId}`
const expectedCommand: string = `${terraformCommand} ${expectedArgs}`

export let env: any = {
    taskScenarioPath:           require.resolve('./import-azurerm-with-options'),
    terraformCommand:           terraformCommand,
    environmentServiceName:     environmentServiceName,
    subscriptionId:             subscriptionId,
    tenantId:                   tenantId,
    servicePrincipalId:         servicePrincipalId,
    servicePrincipalKey:        servicePrincipalKey,
    commandOptions:             commandOptions,
    expectedEnv:                expectedEnv,
    expectedCommand:            expectedCommand,
    expectedArgs:               expectedArgs,
    resourceAddress:            resourceAddress,
    resourceId:                 resourceId
}