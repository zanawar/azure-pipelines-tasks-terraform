import { TaskScenario } from '../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import { env } from './apply-azurerm-with-invalid-auth-scheme.env'
import '../scenarios-terraform';

new TaskScenario<TerraformInputs>()
    .inputAzureRmServiceEndpoint(env.environmentServiceName, env.subscriptionId, env.tenantId, env.servicePrincipalId, env.servicePrincipalKey, env.authScheme)
    .inputTerraformCommand(env.terraformCommand)
    .input({ environmentServiceName: env.environmentServiceName })
    .answerTerraformExists()
    .answerTerraformCommandIsSuccessful()
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .run()