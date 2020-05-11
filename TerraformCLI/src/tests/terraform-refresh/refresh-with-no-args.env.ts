const environmentServiceName = "dev";
const subscriptionId: string = "sub1";
const tenantId: string = "ten1";
const servicePrincipalId: string = "servicePrincipal1";
const servicePrincipalKey: string = "servicePrincipalKey123";
const terraformCommand: string = "refresh";

let expectedEnv: { [key: string]: string } = {
    'ARM_SUBSCRIPTION_ID': subscriptionId,
    'ARM_TENANT_ID': tenantId,
    'ARM_CLIENT_ID': servicePrincipalId,
    'ARM_CLIENT_SECRET': servicePrincipalKey,
}

export let env: any = {
    taskScenarioPath: require.resolve('./refresh-with-no-args'),
    terraformCommand,
    environmentServiceName,
    subscriptionId,
    tenantId,
    servicePrincipalId,
    servicePrincipalKey,
    expectedEnv
}