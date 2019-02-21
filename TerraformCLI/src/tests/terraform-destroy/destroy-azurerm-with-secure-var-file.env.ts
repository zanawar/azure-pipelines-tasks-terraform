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

let terraformCommand: string = 'destroy';
let secureVarsFile: string = 'foo.vars';
let commandArgs: string = `-auto-approve -var-file=${secureVarsFile}`;
let expectedCommand: string = `${terraformCommand} ${commandArgs}`

export let env: any = {
    taskScenarioPath:           require.resolve('./destroy-azurerm-with-secure-var-file'),
    terraformCommand:           terraformCommand,
    commandArgs:                commandArgs,
    environmentServiceName:     environmentServiceName,
    subscriptionId:             subscriptionId,
    tenantId:                   tenantId,
    servicePrincipalId:         servicePrincipalId,
    servicePrincipalKey:        servicePrincipalKey,
    expectedEnv:                expectedEnv,
    expectedCommand:            expectedCommand,
    secureVarsFile:             secureVarsFile
}