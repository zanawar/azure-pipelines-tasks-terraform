import { TaskScenario } from './task-scenario-builder';
import { TerraformCommandAndWorkingDirectory, TaskInputIs } from './task-input-builder';
import { TerraformExists, TerraformCommandIsSuccessful, TerraformCommandWithVarsFileAsWorkingDirFails } from './task-answer-builder';
import { TaskExecutionSucceeded, TaskExecutedTerraformVersion, TaskExecutedTerraformCommand, TaskExecutedWithEnvironmentVariables } from './task-assertion-builder';
import { TaskAzureRmServiceEndpoint } from './task-endpoints-builder';

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

const terraformCommand: string = "plan";

export let planAzureRm = new TaskScenario('./plan-azurerm')
    .givenEndpoint(new TaskAzureRmServiceEndpoint(environmentServiceName, subscriptionId, tenantId, servicePrincipalId, servicePrincipalKey))
    .givenInput(new TerraformCommandAndWorkingDirectory(terraformCommand))
    .andInput((inputs) => new TaskInputIs(inputs, (i) => { i.environmentServiceName = environmentServiceName}))
    .givenAnswer(new TerraformExists())
    .andAnswer((answers) => new TerraformCommandIsSuccessful(answers))
    .andAnswer((answers) => new TerraformCommandWithVarsFileAsWorkingDirFails(answers))
    .whenTaskIsRun()
    .thenAssert(new TaskExecutionSucceeded())
    .andAssert((assertions) => new TaskExecutedTerraformVersion(assertions))    
    .andAssert((assertions) => new TaskExecutedTerraformCommand(assertions, terraformCommand));
    // test runner does not expose env vars set within the task so cannot use this yet
    //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));

