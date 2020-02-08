import { TestScenario } from '../assertions';
import '../assertions-terraform';

describe('terraform validate', function(){
    it('no args', function(){        
        new TestScenario(require.resolve('./validate-with-no-args'))
            .assertExecutionSucceeded()   
            .assertExecutedTerraformCommand("validate")
            .assertExecutedTerraformVersion()
            .run();
    });
    it('with command options', function(){        
        let env = require('./validate-with-options.env').env
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            .run();
    });
    it('with secure var file', function(){
        let env = require('./validate-with-secure-var-file.env').env;
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()   
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            .run();
    });
    it('with secure env file', function(){
        let env = require('./validate-with-secure-env-file.env').env;
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()   
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            .run();
    });
});