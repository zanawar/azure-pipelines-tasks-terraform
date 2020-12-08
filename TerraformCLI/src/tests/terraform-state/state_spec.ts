import { TestScenario } from '../assertions';
import '../assertions-terraform';

describe('terraform state', function(){
    it('can use with options', function(){
        let env = require('./state_rm.env').env
        new TestScenario(env.taskScenarioPath)
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            .assertExecutionSucceeded()
            .run();

    });
});