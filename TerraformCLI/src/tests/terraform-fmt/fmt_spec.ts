import { TestScenario } from '../assertions';
import '../assertions-terraform';

describe('terraform fmt', function(){
    it('no args', function(){        
        new TestScenario(require.resolve('./fmt-with-no-args'))
            .assertExecutionSucceeded()   
            .assertExecutedTerraformCommand("fmt --check --diff")
            .assertExecutedTerraformVersion()
            .run();
    });
    
    it('with command options', function(){        
        let env = require('./fmt-with-options.env').env
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            .run();
    });
    
});