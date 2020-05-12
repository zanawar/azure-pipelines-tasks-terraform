const environmentServiceName = "dev";
const subscriptionId: string = "sub1";
const tenantId: string = "ten1";
const servicePrincipalId: string = "servicePrincipal1";
const servicePrincipalKey: string = "servicePrincipalKey123";

const expectedEnv: { [key: string]: string } = {
    'ARM_SUBSCRIPTION_ID': subscriptionId,
    'ARM_TENANT_ID': tenantId,
    'ARM_CLIENT_ID': servicePrincipalId,
    'ARM_CLIENT_SECRET': servicePrincipalKey,
}

const terraformCommand: string = 'import';
const secureVarsFileId: string = "6b4ef608-ca4c-4185-92fb-0554b8a2ec72"
const secureVarsFileName: string = "./.bin/tests/terraform-import/default.env";
const resourceAddress = "azurerm_resource_group.rg"
const resourceId = "/subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus"
const expectedArgs = `${resourceAddress} ${resourceId}`
const expectedCommand: string = `${terraformCommand} ${expectedArgs}`

export let env: any = {
    taskScenarioPath: require.resolve('./import-azurerm-with-secure-env-file'),
    terraformCommand,
    environmentServiceName,
    subscriptionId,
    tenantId,
    servicePrincipalId,
    servicePrincipalKey,
    expectedEnv,
    expectedArgs,
    expectedCommand,
    secureVarsFileId,
    secureVarsFileName,
    resourceAddress,
    resourceId
}