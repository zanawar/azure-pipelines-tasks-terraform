import { TaskScenario } from '../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import '../scenarios-terraform'

new TaskScenario<TerraformInputs>()
    .inputTerraformCommand('init')
    .input({ backendType : 'foo'})
    .inputApplicationInsightsInstrumentationKey()
    .answerTerraformExists()    
    .answerTerraformCommandIsSuccessful()
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .run()

