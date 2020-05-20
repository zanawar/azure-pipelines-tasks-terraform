import { TestScenario } from '../assertions';
import '../assertions-terraform';

describe('terraform output', function(){
    it('with output variables defined', function(){    
        let env = require('./output-with-output-vars-defined.env').env
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()
            .assertExecutedTerraformVersion()
            .assertPipelineVariablesSet(env.pipelineVariables)
            .run();
    });
    it('with -json flag defined', function(){    
        let env = require('./output-with-json-flag-defined.env').env
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()
            .assertExecutedTerraformVersion()
            .assertPipelineVariablesSet(env.pipelineVariables)
            .run();
    });
    it('with no output variables defined', function(){    
        let env = require('./output-with-no-output-vars-defined.env').env
        new TestScenario(env.taskScenarioPath)
            .assertExecutionSucceeded()
            .assertExecutedTerraformVersion()
            .assertNoOutputPipelineVariablesSet()
            .run();
    });
});