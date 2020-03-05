import { TestScenario } from '../assertions';
import '../assertions-terraform';

describe('terraform show', function(){
    it('with  tfstate input', function(){    
        let env = require('./show-with-input-file.env').env
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()
            .assertExecutedTerraformVersion()
            //Cannot test show command, as it sets command.silent to true
            //causing the test framwork to not be able to find the ran commands
            // in the azdo stdout 
            //.assertExecutedTerraformCommand(env.expectedCommand)
            .run();
    });
});