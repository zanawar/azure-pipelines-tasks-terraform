import { TaskScenario } from '../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import '../scenarios-terraform';
import { env } from './output-with-json-flag-defined.env';

export let showWithNoArgs = new TaskScenario<TerraformInputs>()
    .inputTerraformCommand(env.terraformCommand, env.commandOptions)
    .inputApplicationInsightsInstrumentationKey()
    
    .answerTerraformExists()
    .answerTerraformCommandIsSuccessful(env.expectedArgs, 0, "", env.stdout)
    .run();  