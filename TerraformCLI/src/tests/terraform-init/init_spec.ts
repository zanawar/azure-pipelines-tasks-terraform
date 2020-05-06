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
    it('with command options', function(){        
        let env = require('./init-with-options.env').env
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()
            .assertExecutedTerraformCommand(env.expectedCommand)
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
    it('azurerm backend with ensure backend', function(){
        let env = require('./init-with-backend-azurerm-with-ensure-backend.env').env;
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()            
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            .run();
    })
    it('azurerm backend with ensure existing backend', function(){
        let env = require('./init-with-backend-azurerm-with-ensure-existing-backend.env').env;
        new TestScenario(env.taskScenarioPath)
            .assertExecutedTerraformCommand(env.expectedCommand)    
            .assertExecutedTerraformVersion()
            .assertExecutionSucceeded()      
            .run();
    })
    it('with secure vars file', function(){
        new TestScenario(require.resolve('./init-with-secure-var-file'))    
            .assertExecutedTerraformCommand('init')
            .assertExecutionSucceeded()
            .assertExecutedTerraformVersion()      
            .run();
    })
    it('with secure vars file as tfvar file', function(){
        new TestScenario(require.resolve('./init-with-secure-var-file-as-tfvar-file'))
            .assertExecutionFailed()
            .assertExecutedTerraformVersion()      
            .run();
    });
});