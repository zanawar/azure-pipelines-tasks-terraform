import { TaskScenario } from './scenarios';
import { TerraformInputs } from './scenarios-terraform';
import './scenarios-terraform'

new TaskScenario<TerraformInputs>()
    .inputTerraformCommand('init')
    .answerTerraformExists()    
    .answerTerraformCommandIsSuccessful()
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .run()
