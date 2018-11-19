import { TaskScenario } from '../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import '../scenarios-terraform'

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
    .inputAzureRmServiceEndpoint(backendServiceName, subscriptionId, tenantId, servicePrincipalId, servicePrincipalKey, "foo")
    .inputTerraformCommand(terraformCommand)
    .inputAzureRmBackend(backendServiceName, backendStorageAccountName, backendContainerName, backendKey, backendResourceGroupName)
    .answerTerraformExists()    
    .run()

