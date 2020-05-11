import { TaskScenario } from './../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import '../scenarios-terraform';
import { env } from './refresh-with-options.env';

new TaskScenario<TerraformInputs>()
    .inputAzureRmServiceEndpoint(env.environmentServiceName, env.subscriptionId, env.tenantId, env.servicePrincipalId, env.servicePrincipalKey)
    .inputTerraformCommand(env.terraformCommand, env.commandOptions)
    .input({ environmentServiceName: env.environmentServiceName })  
    .inputApplicationInsightsInstrumentationKey()
    .answerTerraformExists()    
    .answerTerraformCommandIsSuccessful(env.commandOptions)
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .run()
