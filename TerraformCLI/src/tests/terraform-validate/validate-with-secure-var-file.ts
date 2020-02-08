import { TaskScenario } from '../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import '../scenarios-terraform';
import { env } from './validate-with-secure-var-file.env';

export let validateWithNoArgs = new TaskScenario<TerraformInputs>()
    .inputTerraformCommand(env.terraformCommand)
    .inputTerraformSecureVarsFile(env.secureVarsFileId, env.secureVarsFileName)
    .inputApplicationInsightsInstrumentationKey()    
    .answerTerraformExists()
    .answerTerraformCommandIsSuccessful(env.commandOptions)
    .run();

