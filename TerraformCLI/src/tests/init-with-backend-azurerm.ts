import { TaskScenario } from './task-scenario-builder';
import { TerraformInputs } from './terraform-input-decorators';
import './terraform-input-decorators'
import './terraform-answer-decorators'
import './task-endpoint-decorators'

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
const terraformCommandArgs: string = `-backend-config=storage_account_name=${backendStorageAccountName} -backend-config=container_name=${backendContainerName} -backend-config=key=${backendKey} -backend-config=resource_group_name=${backendResourceGroupName} -backend-config=arm_subscription_id=${subscriptionId} -backend-config=arm_tenant_id=${tenantId} -backend-config=arm_client_id=${servicePrincipalId} -backend-config=arm_client_secret=${servicePrincipalKey}`
const expectedCommand: string = `terraform ${terraformCommand} ${terraformCommandArgs}`;

new TaskScenario<TerraformInputs>()
    .withAzureRmServiceEndpoint(backendServiceName, subscriptionId, tenantId, servicePrincipalId, servicePrincipalKey)
    .inputTerraformCommand(terraformCommand)
    .inputAzureRmBackend(backendServiceName, backendStorageAccountName, backendContainerName, backendKey, backendResourceGroupName)
    .answerTerraformExists()    
    .answerTerraformCommandIsSuccessful(terraformCommandArgs)
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .run()
