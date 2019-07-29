import { TaskScenario } from '../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import '../scenarios-terraform'
import { env } from './init-with-backend-azurerm.env';

new TaskScenario<TerraformInputs>()
    .inputAzureRmServiceEndpoint(env.backendServiceName, env.subscriptionId, env.tenantId, env.servicePrincipalId, env.servicePrincipalKey)
    .inputTerraformCommand(env.terraformCommand)
    .inputAzureRmBackend(env.backendServiceName, env.backendStorageAccountName, env.backendContainerName, env.backendKey, env.backendResourceGroupName)
    .inputApplicationInsightsInstrumentationKey()
    .answerTerraformExists()    
    .answerTerraformCommandIsSuccessful(env.commandArgs)
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .run()
