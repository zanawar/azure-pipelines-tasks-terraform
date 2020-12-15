import { TaskScenario } from '../scenarios';
import '../scenarios-terraform';
import { TerraformInputs } from '../scenarios-terraform';

export let fmtWithNoArgs = new TaskScenario<TerraformInputs>()
    .inputTerraformCommand("fmt")
    .inputApplicationInsightsInstrumentationKey()
    .answerTerraformExists()
    .answerTerraformCommandIsSuccessful("--check --diff") // these are default options
    .run();

