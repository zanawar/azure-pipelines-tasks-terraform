import { TaskScenario } from '../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import '../scenarios-terraform'

const secureVarsFileId: string = "6b4ef608-ca4c-4185-92fb-0554b8a2ec72"
const secureVarsFileName: string = "./.bin/tests/terraform-show/default.vars";
const terraformCommand: string = 'show';

export let showWithSecureVarFileAsTfvarFile = new TaskScenario<TerraformInputs>()
    .inputTerraformCommand(terraformCommand)
    .inputTerraformSecureVarsFile(secureVarsFileId, secureVarsFileName)
    .inputApplicationInsightsInstrumentationKey()
    .answerTerraformExists()
    .answerTerraformCommandIsSuccessful()
    .run()
