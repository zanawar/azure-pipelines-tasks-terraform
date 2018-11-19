import { TestScenario } from '../assertions';
import '../assertions-terraform';

describe('terraform init', function(){
    it('no backend', function(){        
        new TestScenario(require.resolve('./init-with-backend-null'))
            .assertExecutionSucceeded()
            .assertExecutedTerraformCommand("init")
            .assertExecutedTerraformVersion()
            .run();
    });
    it('invalid backend', function(){
        new TestScenario(require.resolve('./init-with-backend-invalid'))
            .assertExecutionSucceeded()
            .assertExecutedTerraformCommand("init")
            .assertExecutedTerraformVersion()
            .run();
    }); 
    it('azurerm backend', function(){
        let env = require('./init-with-backend-azurerm.env').env;
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()            
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            .run();
    });       
    it('azurerm backend with invalid auth scheme', function(){
        new TestScenario(require.resolve('./init-with-backend-azurerm-with-invalid-auth'))
            .assertExecutionFailed()     
            .assertExecutedTerraformVersion()
            .run();
    });
});