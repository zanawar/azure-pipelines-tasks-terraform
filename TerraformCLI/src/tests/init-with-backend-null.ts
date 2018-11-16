import { TaskScenario } from './task-scenario-builder';
import { TerraformInputs } from './terraform-input-decorators';
import './terraform-input-decorators'
import './terraform-answer-decorators'

new TaskScenario<TerraformInputs>()
    .inputTerraformCommand('init')
    .answerTerraformExists()    
    .answerTerraformCommandIsSuccessful()
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .run()
