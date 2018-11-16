import { TaskScenario } from './task-scenario-builder';
import { TerraformCommandAndWorkingDirectory, VarsFileIs } from './task-input-builder';
import { TerraformExists, TerraformCommandIsSuccessful, TerraformCommandWithVarsFileAsWorkingDirFails } from './task-answer-builder';

export let validateWithNoArgs = new TaskScenario()
    .givenInput(new TerraformCommandAndWorkingDirectory(("validate")))       
    .andInput((inputs) => new VarsFileIs(inputs, 'foo.vars')) 
    .givenAnswer(new TerraformExists())
    .andAnswer((answers) => new TerraformCommandIsSuccessful(answers))
    .andAnswer((answers) => new TerraformCommandWithVarsFileAsWorkingDirFails(answers))
    .whenTaskIsRun();

