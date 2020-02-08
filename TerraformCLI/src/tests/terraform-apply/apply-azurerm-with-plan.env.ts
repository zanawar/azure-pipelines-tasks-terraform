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

const terraformCommand: string = "apply";
const plan: string = "terraform.tfplan"
const secureVarsFileId: string = "bc813121-0bf2-4713-9949-bfb54023bd6c"
const secureVarsFileName: string = "./.bin/tests/terraform-apply/default.vars";
const commandOptions: string = `${plan}`;
const expectedOptions: string = `-var-file=${secureVarsFileName} -auto-approve ${plan}`;
const expectedCommand: string = `${terraformCommand} ${expectedOptions}`

export let env: any = {
    taskScenarioPath:           require.resolve('./apply-azurerm-with-plan'),
    terraformCommand,
    commandOptions,
    plan,
    secureVarsFileId,
    secureVarsFileName,
    expectedOptions,
    expectedCommand,
    environmentServiceName,
    subscriptionId,
    tenantId,
    servicePrincipalId,
    servicePrincipalKey,
    expectedEnv
}