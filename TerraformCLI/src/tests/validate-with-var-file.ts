import { TaskScenario } from './task-scenario-builder';
import { TerraformInputs } from './terraform-input-decorators';
import './terraform-input-decorators'
import './terraform-answer-decorators'

export let validateWithNoArgs = new TaskScenario<TerraformInputs>()
    .inputTerraformCommand("validate")
    .inputTerraformVarsFile("foo.vars")
    .answerTerraformExists()
    .answerTerraformCommandIsSuccessful()
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .run();

