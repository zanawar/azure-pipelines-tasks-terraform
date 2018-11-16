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

export let initWithBackendAzureRmWithInvalidAuth = new TaskScenario<TerraformInputs>()
    .withAzureRmServiceEndpoint(backendServiceName, subscriptionId, tenantId, servicePrincipalId, servicePrincipalKey, "foo")
    .inputTerraformCommand(terraformCommand)
    .inputAzureRmBackend(backendServiceName, backendStorageAccountName, backendContainerName, backendKey, backendResourceGroupName)
    .answerTerraformExists()    
    .run()

