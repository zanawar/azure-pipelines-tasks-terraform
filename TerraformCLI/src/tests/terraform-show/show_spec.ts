import { TestScenario } from '../assertions';
import '../assertions-terraform';

describe('terraform show', function(){
    it('with  tfstate input', function(){    
        let env = require('./show-with-input-file.env').env
        new TestScenario(env.taskScenarioPath)
            //.assertExecutionSucceeded()
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            .run();
    });
});