import { TaskScenario } from "../scenarios";
import { TerraformInputs } from '../scenarios-terraform';
import '../scenarios-terraform';
import { env } from './import-without-envservicename.env';

new TaskScenario<TerraformInputs>()
    // .inputAzureRmServiceEndpoint(env.environmentServiceName, env.subscriptionId, env.tenantId, env.servicePrincipalId, env.servicePrincipalKey)
    .inputTerraformCommand(env.terraformCommand)
    // do not provide environmentServiceName input
    // .input({ environmentServiceName: env.environmentServiceName })
    .input({ resourceAddress: env.resourceAddress, resourceId: env.resourceId })
    .inputApplicationInsightsInstrumentationKey()
    .answerTerraformExists()
    .answerTerraformCommandIsSuccessful(env.commandOptions)
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .run()