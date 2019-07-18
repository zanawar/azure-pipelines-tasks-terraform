import { TaskScenario } from './../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import '../scenarios-terraform';
import { env } from './apply-azurerm-with-plan.env';

new TaskScenario<TerraformInputs>()
    .inputAzureRmServiceEndpoint(env.environmentServiceName, env.subscriptionId, env.tenantId, env.servicePrincipalId, env.servicePrincipalKey)
    .inputTerraformCommand(env.terraformCommand, env.commandOptions)
    .inputTerraformSecureVarsFile(env.secureVarsFile)
    .input({ environmentServiceName: env.environmentServiceName })
    .inputApplicationInsightsInstrumentationKey()
    .answerTerraformExists()    
    .answerTerraformCommandIsSuccessful(env.expectedOptions)
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .run()
