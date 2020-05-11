const environmentServiceName = "dev";
const subscriptionId: string = "sub1";
const tenantId: string = "ten1";
const servicePrincipalId: string = "servicePrincipal1";
const servicePrincipalKey: string = "servicePrincipalKey123";
const terraformCommand: string = "refresh";
const secureVarsFileId: string = "6b4ef608-ca4c-4185-92fb-0554b8a2ec72"
const secureVarsFileName: string = "./.bin/tests/terraform-refresh/default.env";
const expectedCommand: string = `${terraformCommand}`

const expectedEnv: { [key: string]: string } = {
    'ARM_SUBSCRIPTION_ID': subscriptionId,
    'ARM_TENANT_ID': tenantId,
    'ARM_CLIENT_ID': servicePrincipalId,
    'ARM_CLIENT_SECRET': servicePrincipalKey,
}

export let env: any = {
    taskScenarioPath: require.resolve('./refresh-with-secure-env-file'),
    terraformCommand,
    secureVarsFileId,
    secureVarsFileName,
    expectedCommand,
    environmentServiceName,
    subscriptionId,
    tenantId,
    servicePrincipalId,
    servicePrincipalKey,
    expectedEnv
}