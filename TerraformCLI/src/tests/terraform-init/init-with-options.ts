import { TaskScenario } from './../scenarios';
import { TerraformInputs } from './../scenarios-terraform';
import './../scenarios-terraform';
import { env } from './init-with-options.env';

new TaskScenario<TerraformInputs>()
    .inputTerraformCommand(env.terraformCommand, env.commandOptions)
    .inputApplicationInsightsInstrumentationKey()
    .answerTerraformExists()    
    .answerTerraformCommandIsSuccessful(env.commandOptions)
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .run()
