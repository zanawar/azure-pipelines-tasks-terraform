import { TaskScenario } from '../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import '../scenarios-terraform'

const environmentServiceName = "dev";
const subscriptionId: string = "sub1";
const tenantId: string = "ten1";
const servicePrincipalId: string = "servicePrincipal1";
const servicePrincipalKey: string = "servicePrincipalKey123";
const authScheme: string = 'foo';

const expectedEnv: { [key: string]: string } = {
    'ARM_SUBSCRIPTION_ID': subscriptionId,
    'ARM_TENANT_ID': tenantId,
    'ARM_CLIENT_ID': servicePrincipalId,
    'ARM_CLIENT_SECRET': servicePrincipalKey,
}

const terraformCommand: string = "import";

new TaskScenario<TerraformInputs>()
    .inputAzureRmServiceEndpoint(environmentServiceName, subscriptionId, tenantId, servicePrincipalId, servicePrincipalKey, authScheme)
    .inputTerraformCommand(terraformCommand)
    .input({ environmentServiceName: environmentServiceName })
    .answerTerraformExists()
    .answerTerraformCommandIsSuccessful()
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .run()


