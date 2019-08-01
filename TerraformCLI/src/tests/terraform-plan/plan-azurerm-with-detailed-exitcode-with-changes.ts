import { TaskScenario } from './../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import '../scenarios-terraform';
import { env } from './plan-azurerm-with-detailed-exitcode-with-changes.env';

new TaskScenario<TerraformInputs>()
    .inputAzureRmServiceEndpoint(env.environmentServiceName, env.subscriptionId, env.tenantId, env.servicePrincipalId, env.servicePrincipalKey)
    .inputTerraformCommand(env.terraformCommand, env.commandOptions)
    .input({ environmentServiceName: env.environmentServiceName })    
    .inputApplicationInsightsInstrumentationKey()
    .answerTerraformExists()    
    .answerTerraformCommandIsSuccessful(env.commandOptions, 2)
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .run()
