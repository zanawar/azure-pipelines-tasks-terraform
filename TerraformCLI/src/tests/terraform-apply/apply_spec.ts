import { TestScenario } from '../assertions';
import '../assertions-terraform';

describe('terraform apply', function(){
    it('azurerm', function(){    
        let env = require('./apply-azurerm.env').env;
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()   
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    });
    it('azurerm with command options', function(){        
        let env = require('./apply-azurerm-with-options.env').env
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            .run();
            
    });
    it('azurerm with var file', function(){        
        let env = require('./apply-azurerm-with-var-file.env').env;
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()   
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    });
    it('azurerm with invalid auth scheme', function(){        
        let env = require('./apply-azurerm-with-invalid-auth-scheme.env').env;
        new TestScenario(env.taskScenarioPath)
            .assertExecutionFailed('Terraform only supports service principal authorization for azure')
            .assertExecutedTerraformVersion()
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, env.expectedEnv));
            .run();
    })
});