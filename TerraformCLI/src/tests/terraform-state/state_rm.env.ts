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

const terraformCommand: string = "state";
const commandOptions: string = `rm 'module.foo'`;
const expectedCommand: string = `${terraformCommand} ${commandOptions}`

export let env: any = {
    taskScenarioPath:           require.resolve('./state_rm'),
    terraformCommand,
    commandOptions,
    expectedCommand,
    environmentServiceName,
    subscriptionId,
    tenantId,
    servicePrincipalId,
    servicePrincipalKey,
    expectedEnv
}