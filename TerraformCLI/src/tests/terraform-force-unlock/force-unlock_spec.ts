import { TestScenario } from '../assertions';
import '../assertions-terraform';

describe('terraform force-unlock', function(){
    it('azurerm', function(){
        const env = require('./force-unlock-azurerm.env').env;
        new TestScenario(env.taskScenarioPath)
            .assertExecutedTerraformCommand(env.expectedCommand)
            .assertExecutedTerraformVersion()
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    });
});