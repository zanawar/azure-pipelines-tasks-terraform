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
    it('with var file', function(){
        let varFile = 'foo.vars';
        let terraformCommand = 'validate';
        let commandArgs = `-var-file=${varFile}`
        let expectedCommand = `${terraformCommand} ${commandArgs}`
        new TestScenario(require.resolve('./validate-with-var-file'))
            .assertExecutionSucceeded()   
            .assertExecutedTerraformCommand(expectedCommand)
            .assertExecutedTerraformVersion()
            .run();
    });
});