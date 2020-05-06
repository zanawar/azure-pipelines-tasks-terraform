import { TaskScenario } from '../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import '../scenarios-terraform'

new TaskScenario<TerraformInputs>()
    .inputTerraformCommand('init')
    .inputTerraformSecureVarsFile('6b4ef608-ca4c-4185-92fb-0554b8a2ec72', './.bin/tests/terraform-init/default.env')
    .inputApplicationInsightsInstrumentationKey()
    .answerTerraformExists()    
    .answerTerraformCommandIsSuccessful()
    .run()