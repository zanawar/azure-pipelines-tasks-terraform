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
    });it('azurerm with command options', function(){        
        let env = require('./plan-with-options.env').env
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            .run();
    });
    it('azurerm with var file', function(){
        let env = require('./plan-azurerm-with-var-file.env').env;
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
});