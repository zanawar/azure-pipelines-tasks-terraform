import { TaskScenario } from '../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import '../scenarios-terraform';
import { env } from './refresh-with-secure-env-file.env';

export let refreshWithNoArgs = new TaskScenario<TerraformInputs>()
    .inputAzureRmServiceEndpoint(env.environmentServiceName, env.subscriptionId, env.tenantId, env.servicePrincipalId, env.servicePrincipalKey)
    .inputTerraformCommand(env.terraformCommand)
    .inputTerraformSecureVarsFile(env.secureVarsFileId, env.secureVarsFileName)
    .input({ environmentServiceName: env.environmentServiceName })
    .inputApplicationInsightsInstrumentationKey()    
    .answerTerraformExists()
    .answerTerraformCommandIsSuccessful()
    .run();

