const environmentServiceName = "dev";
const subscriptionId: string = "sub1";
const tenantId: string = "ten1";
const servicePrincipalId: string = "servicePrincipal1";
const servicePrincipalKey: string = "servicePrincipalKey123";
const terraformCommand: string = "refresh";
const commandOptions:string = "-input=true -lock=false -no-color"
const expectedCommand: string = `${terraformCommand} ${commandOptions}`

const expectedEnv: { [key: string]: string } = {
    'ARM_SUBSCRIPTION_ID': subscriptionId,
    'ARM_TENANT_ID': tenantId,
    'ARM_CLIENT_ID': servicePrincipalId,
    'ARM_CLIENT_SECRET': servicePrincipalKey,
}

export let env: any = {
    taskScenarioPath:       require.resolve('./refresh-with-options'),
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