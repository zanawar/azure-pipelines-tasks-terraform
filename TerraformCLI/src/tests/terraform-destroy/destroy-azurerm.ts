import { TaskScenario } from '../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import { env } from './destroy-azurerm.env';
import '../scenarios-terraform'

new TaskScenario<TerraformInputs>()
    .inputAzureRmServiceEndpoint(env.environmentServiceName, env.subscriptionId, env.tenantId, env.servicePrincipalId, env.servicePrincipalKey)
    .inputTerraformCommand(env.terraformCommand)
    .input({ environmentServiceName: env.environmentServiceName })
    .inputApplicationInsightsInstrumentationKey()
    .answerTerraformExists()
    .answerTerraformCommandIsSuccessful(env.commandArgs)
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .run()