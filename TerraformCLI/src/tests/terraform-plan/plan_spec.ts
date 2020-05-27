import { TestScenario } from '../assertions';
import '../assertions-terraform';

describe('terraform plan', function(){
    it('azurerm', function(){
        let env = require('./plan-azurerm.env').env;
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()
            .assertExecutedTerraformCommand(env.terraformCommand)
            .assertExecutedTerraformVersion()
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    });
    it('azurerm with command options', function(){
        let env = require('./plan-azurerm-with-options.env').env
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            .run();
    });
    it('azurerm with detailed exit code and changes present', function(){
        let env = require('./plan-azurerm-with-detailed-exitcode-with-changes.env').env
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            .assertPipelineVariableSet("TERRAFORM_LAST_EXITCODE", "2")
            .assertPipelineVariableSet("TERRAFORM_PLAN_HAS_CHANGES", "true")
            .run();
    });
    it('azurerm with detailed exit code and no changes present', function(){
        let env = require('./plan-azurerm-with-detailed-exitcode-without-changes.env').env
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            .assertPipelineVariableSet("TERRAFORM_LAST_EXITCODE", "0")
            .assertPipelineVariableSet("TERRAFORM_PLAN_HAS_CHANGES", "false")
            .run();
    });
    it('azurerm with secure var file', function(){
        let env = require('./plan-azurerm-with-secure-var-file.env').env;
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    });
    it('azurerm with secure env file', function(){
        let env = require('./plan-azurerm-with-secure-env-file.env').env;
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    });
    it('azurerm with invalid auth scheme', function(){
        new TestScenario(require.resolve('./plan-azurerm-with-invalid-auth-scheme'))
            .assertExecutionFailed('Terraform only supports service principal authorization for azure')
            .assertExecutedTerraformVersion()
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    });
    it('without envservicename', function(){
        let env = require('./plan-without-envservicename.env').env;
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    });
});