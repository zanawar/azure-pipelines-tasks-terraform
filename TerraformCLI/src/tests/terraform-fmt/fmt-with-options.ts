import '../scenarios-terraform';
import { TerraformInputs } from '../scenarios-terraform';
import { TaskScenario } from './../scenarios';
import { env } from './fmt-with-options.env';

export let fmtWithOpts = new TaskScenario<TerraformInputs>()
    .inputTerraformCommand(env.terraformCommand, env.commandOptions)
    .inputApplicationInsightsInstrumentationKey()
    .answerTerraformExists()    
    .answerTerraformCommandIsSuccessful(env.commandOptions)
    .run()
