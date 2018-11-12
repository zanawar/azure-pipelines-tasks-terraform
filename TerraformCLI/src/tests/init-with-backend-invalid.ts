import { TaskScenario } from './task-scenario-builder';
import { TerraformCommandAndWorkingDirectory, TaskInputIs } from './task-input-builder';
import { TerraformExists, TerraformCommandIsSuccessful, TerraformCommandWithVarsFileAsWorkingDirFails } from './task-answer-builder';
import { TaskExecutionSucceeded, TaskExecutedCommand, TaskExecutedTerraformVersion } from './task-assertion-builder';

export let initWithInvalidBackend = new TaskScenario()
    .givenInput(new TerraformCommandAndWorkingDirectory("init"))
    .andInput((inputs) => new TaskInputIs(inputs, (i) => { i.backendType = "foo" }))    
    .givenAnswer(new TerraformExists())
    .andAnswer((answers) => new TerraformCommandIsSuccessful(answers))
    .andAnswer((answers) => new TerraformCommandWithVarsFileAsWorkingDirFails(answers))
    .whenTaskIsRun()
    // .thenAssert(new TaskExecutionSucceeded())
    // .andAssert((assertions) => new TaskExecutedCommand(assertions, "terraform init"))
    // .andAssert((assertions) => new TaskExecutedTerraformVersion(assertions));

