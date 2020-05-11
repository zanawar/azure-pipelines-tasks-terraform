import { TestScenario } from '../assertions';
import '../assertions-terraform';

describe('terraform refresh', function(){
    it('no args', function(){        
        new TestScenario(require.resolve('./refresh-with-no-args'))
            .assertExecutionSucceeded()   
            .assertExecutedTerraformCommand("refresh")
            .assertExecutedTerraformVersion()
            .run();
    });
    it('with command options', function(){        
        let env = require('./refresh-with-options.env').env
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            .run();
    });
    it('with secure var file', function(){
        let env = require('./refresh-with-secure-var-file.env').env;
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()   
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            .run();
    });
    it('with secure env file', function(){
        let env = require('./refresh-with-secure-env-file.env').env;
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()   
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            .run();
    });
});