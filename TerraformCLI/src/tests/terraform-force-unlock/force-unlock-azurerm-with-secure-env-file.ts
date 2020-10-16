import { TaskScenario } from '../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import '../scenarios-terraform'
import { env } from './force-unlock-azurerm-with-secure-env-file.env';

new TaskScenario<TerraformInputs>()
    .inputAzureRmServiceEndpoint(env.environmentServiceName, env.subscriptionId, env.tenantId, env.servicePrincipalId, env.servicePrincipalKey)
    .inputTerraformCommand(env.terraformCommand)
    .input({ environmentServiceName: env.environmentServiceName })
    .input({ lockID: env.lockID })
    .inputTerraformSecureVarsFile(env.secureVarsFileId, env.secureVarsFileName)
    .inputApplicationInsightsInstrumentationKey()
    .answerTerraformExists()
    .answerTerraformCommandIsSuccessful(env.expectedCommand)
    .run()
