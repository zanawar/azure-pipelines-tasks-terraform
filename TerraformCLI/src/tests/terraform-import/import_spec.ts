import { TestScenario } from '../assertions';
import '../assertions-terraform';

describe('terraform import', function(){
    it('azurerm', function(){    
        let env = require('./import-azurerm.env').env;
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()   
            .assertExecutedTerraformCommand(env.terraformCommand)
            .assertExecutedTerraformVersion()
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    });
    it('azurerm with command options', function(){        
        let env = require('./import-azurerm-with-options.env').env
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            .run();
    });
    it('azurerm with secure var file', function(){
        let env = require('./import-azurerm-with-secure-var-file.env').env;
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()   
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    });
    it('azurerm with invalid auth scheme', function(){
        new TestScenario(require.resolve('./import-azurerm-with-invalid-auth-scheme'))
            .assertExecutionFailed('Terraform only supports service principal authorization for azure')
            .assertExecutedTerraformVersion()
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    });
});