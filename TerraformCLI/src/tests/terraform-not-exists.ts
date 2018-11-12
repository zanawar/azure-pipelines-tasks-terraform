import { TaskScenario } from './task-scenario-builder';
import { TerraformCommandAndWorkingDirectory } from './task-input-builder';
import { TerraformExists } from './task-answer-builder';

new TaskScenario()
    .givenInput(new TerraformCommandAndWorkingDirectory("version"))    
    .givenAnswer(new TerraformExists(false))
    .whenTaskIsRun();