import { TaskScenario } from '../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import '../scenarios-terraform'

new TaskScenario<TerraformInputs>()
    .inputTerraformCommand("version")
    .inputApplicationInsightsInstrumentationKey()
    .answerTerraformExists(false)
    .run();