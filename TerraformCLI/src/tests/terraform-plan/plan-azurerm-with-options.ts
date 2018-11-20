import { TaskScenario } from './../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import '../scenarios-terraform';
import { env } from './plan-azurerm-with-options.env';

new TaskScenario<TerraformInputs>()
    .inputAzureRmServiceEndpoint(env.environmentServiceName, env.subscriptionId, env.tenantId, env.servicePrincipalId, env.servicePrincipalKey)
    .inputTerraformCommand(env.terraformCommand, env.commandOptions)
    .input({ environmentServiceName: env.environmentServiceName })
    .answerTerraformExists()    
    .answerTerraformCommandIsSuccessful(env.commandOptions)
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .run()
