import { TaskScenario } from './task-scenario-builder';
import { TerraformInputs } from './terraform-input-decorators';
import './terraform-input-decorators'
import './terraform-answer-decorators'
import './task-endpoint-decorators'

const environmentServiceName = "dev";
const subscriptionId: string = "sub1";
const tenantId: string = "ten1";
const servicePrincipalId: string = "servicePrincipal1";
const servicePrincipalKey: string = "servicePrincipalKey123";

const expectedEnv: { [key: string]: string } = {
    'ARM_SUBSCRIPTION_ID': subscriptionId,
    'ARM_TENANT_ID': tenantId,
    'ARM_CLIENT_ID': servicePrincipalId,
    'ARM_CLIENT_SECRET': servicePrincipalKey,
}

const terraformCommand: string = "apply";
const commandArgs: string = '-auto-approve';

new TaskScenario<TerraformInputs>()
    .withAzureRmServiceEndpoint(environmentServiceName, subscriptionId, tenantId, servicePrincipalId, servicePrincipalKey)
    .inputTerraformCommand(terraformCommand)
    .withInputs({ environmentServiceName: environmentServiceName })
    .inputTerraformVarsFile('foo.vars')
    .answerTerraformExists()
    .answerTerraformCommandIsSuccessful(commandArgs)
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .run()