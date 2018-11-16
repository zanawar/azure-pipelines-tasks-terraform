import { TaskScenario } from './scenarios';
import { TerraformInputs } from './scenarios-terraform';
import './scenarios-terraform'

new TaskScenario<TerraformInputs>()
    .inputTerraformCommand('init')
    .withInputs({ backendType : 'foo'})
    .answerTerraformExists()    
    .answerTerraformCommandIsSuccessful()
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .run()

