import { TaskScenario } from './task-scenario-builder';
import { TerraformCommandAndWorkingDirectory, TerraformExists } from './any-steps';

let scenario = new TaskScenario()
    .givenInput(new TerraformCommandAndWorkingDirectory("version"))
    
    .givenAnswer(new TerraformExists(false))
    .run();