const environmentServiceName = "dev";
const subscriptionId: string = "sub1";
const tenantId: string = "ten1";
const servicePrincipalId: string = "servicePrincipal1";
const servicePrincipalKey: string = "servicePrincipalKey123";
const terraformCommand: string = "refresh";
const secureVarsFileId: string = "bc813121-0bf2-4713-9949-bfb54023bd6c"
const secureVarsFileName: string = "./.bin/tests/terraform-refresh/default.vars";
const commandOptions: string = `-var-file=${secureVarsFileName}`;
const expectedCommand: string = `${terraformCommand} ${commandOptions}`

const expectedEnv: { [key: string]: string } = {
    'ARM_SUBSCRIPTION_ID': subscriptionId,
    'ARM_TENANT_ID': tenantId,
    'ARM_CLIENT_ID': servicePrincipalId,
    'ARM_CLIENT_SECRET': servicePrincipalKey,
}

export let env: any = {
    taskScenarioPath: require.resolve('./refresh-with-secure-var-file'),
    commandOptions,
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