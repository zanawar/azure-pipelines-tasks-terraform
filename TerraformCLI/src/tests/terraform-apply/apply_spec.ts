import { TestScenario } from '../assertions';
import '../assertions-terraform';

describe('terraform apply', function(){
    it('azurerm', function(){    
        let env = require('./apply-azurerm.env');
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()   
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    });
    it('azurerm with var file', function(){
        let varFile = 'foo.vars';
        let terraformCommand = 'apply';
        let commandArgs = `-auto-approve -var-file=${varFile}`
        let expectedCommand = `${terraformCommand} ${commandArgs}`
        new TestScenario(require.resolve('./apply-azurerm-with-var-file'))
            .assertExecutionSucceeded()   
            .assertExecutedTerraformCommand(expectedCommand)
            .assertExecutedTerraformVersion()
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    });
    it('azurerm with invalid auth scheme', function(){
        new TestScenario(require.resolve('./apply-azurerm-with-invalid-auth-scheme'))
            .assertExecutionFailed('Terraform only supports service principal authorization for azure')
            .assertExecutedTerraformVersion()
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    })
});