import { TaskScenario } from '../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import '../scenarios-terraform'
import { env } from './import-azurerm.env'

new TaskScenario<TerraformInputs>()
    .inputAzureRmServiceEndpoint(env.environmentServiceName, env.subscriptionId, env.tenantId, env.servicePrincipalId, env.servicePrincipalKey)
    .inputTerraformCommand(env.terraformCommand)
    .input({ environmentServiceName: env.environmentServiceName })
    .input({ resourceAddress: env.resourceAddress, resourceId: env.resourceId })
    .inputApplicationInsightsInstrumentationKey()
    .answerTerraformExists()
    .answerTerraformCommandIsSuccessful(env.commandOptions)
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .run()