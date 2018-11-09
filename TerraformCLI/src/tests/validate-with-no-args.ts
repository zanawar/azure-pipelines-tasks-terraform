import { TaskScenario } from './task-scenario-builder';
import { TerraformCommandAndWorkingDirectory } from './task-input-builder';
import { TerraformExists, TerraformCommandIsSuccessful, TerraformCommandWithVarsFileAsWorkingDirFails } from './task-answer-builder';
import { TaskExecutionSucceeded, TaskExecutedCommand, TaskExecutedTerraformVersion } from './task-assertion-builder';

export let validateWithNoArgs = new TaskScenario('./validate-with-no-args')
    .givenInput(new TerraformCommandAndWorkingDirectory(("validate")))        
    .givenAnswer(new TerraformExists())
    .andAnswer((answers) => new TerraformCommandIsSuccessful(answers))
    .andAnswer((answers) => new TerraformCommandWithVarsFileAsWorkingDirFails(answers))
    .whenTaskIsRun()
    .thenAssert(new TaskExecutionSucceeded())
    .andAssert((assertions) => new TaskExecutedCommand(assertions, "terraform validate"))
    .andAssert((assertions) => new TaskExecutedTerraformVersion(assertions));

