import { TaskScenario } from './task-scenario-builder';
import { TerraformCommandAndWorkingDirectory, TerraformAzureRmBackend } from './task-input-builder';
import { TerraformExists } from './task-answer-builder';
import { TaskExecutedTerraformVersion, TaskExecutionFailed } from './task-assertion-builder';
import { TaskAzureRmServiceEndpoint } from './task-endpoints-builder';

const backendServiceName = "backend";
const backendStorageAccountName: string = "storage";
const backendContainerName: string = "container";
const backendKey: string = "storageKey123";
const backendResourceGroupName: string = "rg-backend-storage";
const subscriptionId: string = "sub1";
const tenantId: string = "ten1";
const servicePrincipalId: string = "prin1";
const servicePrincipalKey: string = "servicePrincipalKey123";

const terraformCommand: string = "init";

export let initWithBackendAzureRmWithInvalidAuth = new TaskScenario('./init-with-backend-azurerm-with-invalid-auth')
    .givenEndpoint(new TaskAzureRmServiceEndpoint(backendServiceName, subscriptionId, tenantId, servicePrincipalId, servicePrincipalKey, "foo"))
    .givenInput(new TerraformCommandAndWorkingDirectory(terraformCommand))
    .andInput((inputs) => new TerraformAzureRmBackend(inputs, backendServiceName, backendStorageAccountName, backendContainerName, backendKey, backendResourceGroupName))
    .givenAnswer(new TerraformExists())
    .whenTaskIsRun()
    .thenAssert(new TaskExecutionFailed())
    .andAssert((assertions) => new TaskExecutedTerraformVersion(assertions));

