import { TestScenario } from '../assertions';
import '../assertions-terraform';

describe('terraform show', function(){
    it('with tfstate input', function(){    
        let env = require('./show-with-tfstate-input-file.env').env
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()
            .assertExecutedTerraformVersion()
            //Cannot test show command, as it sets command.silent to true
            //causing the test framwork to not be able to find the ran commands
            // in the azdo stdout 
            //.assertExecutedTerraformCommand(env.expectedCommand)
            .run();
    });
    it('with plan input with destroy', function(){    
        let env = require('./show-with-plan-input-file-with-destroy.env').env
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()
            .assertExecutedTerraformVersion()
            //Cannot test show command, as it sets command.silent to true
            //causing the test framwork to not be able to find the ran commands
            // in the azdo stdout 
            //.assertExecutedTerraformCommand(env.expectedCommand)
            .run();
    });
    it('with plan input with no destroy', function(){    
        let env = require('./show-with-plan-input-file-with-no-destroy.env').env
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()
            .assertExecutedTerraformVersion()
            //Cannot test show command, as it sets command.silent to true
            //causing the test framwork to not be able to find the ran commands
            // in the azdo stdout 
            //.assertExecutedTerraformCommand(env.expectedCommand)
            .run();
    });
    it('with no input', function(){    
        let env = require('./show-with-no-input-file.env').env
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