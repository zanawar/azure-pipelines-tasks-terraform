import { TaskScenario } from './task-scenario-builder';
import { TerraformExists, TerraformCommandAndWorkingDirectory, TerraformCommandIsSuccessful, TerraformCommandWithVarsFileAsWorkingDirFails } from './any-steps';

// writing these to stdout will force a failure from the MockTestRunner
// console.log('##vso[task.issue type=error;]Error: foobar!')
// console.log('##vso[task.complete result=Failed;]Error: foobar!')

let scenario = new TaskScenario()
    .givenInput(new TerraformCommandAndWorkingDirectory("init"))
    
    .givenAnswer(new TerraformExists())
    .andAnswer((answers) => new TerraformCommandIsSuccessful(answers))
    .andAnswer((answers) => new TerraformCommandWithVarsFileAsWorkingDirFails(answers))
    .run();

