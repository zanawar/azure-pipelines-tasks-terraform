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

const terraformCommand: string = 'destroy';
const secureVarsFileId: string = "bc813121-0bf2-4713-9949-bfb54023bd6c"
const secureVarsFileName: string = "./.bin/tests/terraform-destroy/default.env";
const commandArgs: string = `-auto-approve`;
const expectedCommand: string = `${terraformCommand} ${commandArgs}`

export const env: any = {
    taskScenarioPath: require.resolve('./destroy-azurerm-with-secure-env-file'),
    terraformCommand,
    commandArgs,
    environmentServiceName,
    subscriptionId,
    tenantId,
    servicePrincipalId,
    servicePrincipalKey,
    expectedEnv,
    expectedCommand,
    secureVarsFileId,
    secureVarsFileName
}