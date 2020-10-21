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

const terraformCommand: string = 'forceunlock';
const lockID = "3ea12870-968e-b9b9-cf3b-f4c3fbe36684";
const expectedCommand = `force-unlock -force ${lockID}`

export let env: any = {
    taskScenarioPath:           require.resolve('./force-unlock-azurerm'),
    terraformCommand:           terraformCommand,
    environmentServiceName:     environmentServiceName,
    subscriptionId:             subscriptionId,
    tenantId:                   tenantId,
    servicePrincipalId:         servicePrincipalId,
    servicePrincipalKey:        servicePrincipalKey,
    expectedEnv:                expectedEnv,
    expectedCommand:            expectedCommand,
    lockID:                     lockID
}