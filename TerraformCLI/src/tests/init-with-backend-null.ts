import { TaskScenario } from './task-scenario-builder';
import { TerraformCommandAndWorkingDirectory } from './task-input-builder';
import { TerraformExists, TerraformCommandIsSuccessful, TerraformCommandWithVarsFileAsWorkingDirFails } from './task-answer-builder';
import { TaskExecutionSucceeded, TaskExecutedCommand, TaskExecutedTerraformVersion } from './task-assertion-builder';

export let initWithBackendNull = new TaskScenario()
    .givenInput(new TerraformCommandAndWorkingDirectory("init"))    
    .givenAnswer(new TerraformExists())
    .andAnswer((answers) => new TerraformCommandIsSuccessful(answers))
    .andAnswer((answers) => new TerraformCommandWithVarsFileAsWorkingDirFails(answers))
    .whenTaskIsRun()
    // .thenAssert(new TaskExecutionSucceeded())
    // .andAssert((assertions) => new TaskExecutedCommand(assertions, "terraform init"))
    // .andAssert((assertions) => new TaskExecutedTerraformVersion(assertions));


