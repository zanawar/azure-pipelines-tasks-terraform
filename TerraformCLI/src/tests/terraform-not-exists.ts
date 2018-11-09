import { TaskScenario } from './task-scenario-builder';
import { TerraformCommandAndWorkingDirectory } from './task-input-builder';
import { TerraformExists } from './task-answer-builder';
import { TaskExecutionFailed } from './task-assertion-builder';

export let terraformNotExists = new TaskScenario('./terraform-not-exists')
    .givenInput(new TerraformCommandAndWorkingDirectory("version"))    
    .givenAnswer(new TerraformExists(false))
    .whenTaskIsRun()
    .thenAssert(new TaskExecutionFailed());