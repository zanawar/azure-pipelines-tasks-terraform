import { TaskScenario } from '../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import { env } from './apply-azurerm-with-secure-env-file.env';
import '../scenarios-terraform'

new TaskScenario<TerraformInputs>()
    .inputAzureRmServiceEndpoint(env.environmentServiceName, env.subscriptionId, env.tenantId, env.servicePrincipalId, env.servicePrincipalKey)
    .inputTerraformCommand(env.terraformCommand)
    .input({ environmentServiceName: env.environmentServiceName })
    .inputTerraformSecureVarsFile(env.secureVarsFileId, env.secureVarsFileName)
    .inputApplicationInsightsInstrumentationKey()
    .answerTerraformExists()
    .answerTerraformCommandIsSuccessful(env.commandArgs)
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .run()