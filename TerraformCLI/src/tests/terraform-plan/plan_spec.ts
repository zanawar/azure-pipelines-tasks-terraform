import { TestScenario } from '../assertions';
import '../assertions-terraform';

describe('terraform plan', function(){
    it('azurerm', function(){    
        new TestScenario(require.resolve('./plan-azurerm'))
            .assertExecutionSucceeded()   
            .assertExecutedTerraformCommand("plan")
            .assertExecutedTerraformVersion()
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    });
    it('azurerm with var file', function(){
        let varFile = 'foo.vars';
        let terraformCommand = 'plan';
        let commandArgs = `-var-file=${varFile}`
        let expectedCommand = `${terraformCommand} ${commandArgs}`
        new TestScenario(require.resolve('./plan-azurerm-with-var-file'))
            .assertExecutionSucceeded()   
            .assertExecutedTerraformCommand(expectedCommand)
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
});