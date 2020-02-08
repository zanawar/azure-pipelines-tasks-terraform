import { TaskScenario } from '../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import '../scenarios-terraform';
import { env } from './validate-with-secure-env-file.env';

export let validateWithNoArgs = new TaskScenario<TerraformInputs>()
    .inputTerraformCommand(env.terraformCommand)
    .inputTerraformSecureVarsFile(env.secureVarsFileId)
    .inputSecureFile(env.secureVarsFileId, env.secureVarsFileName)
    .inputEnvVar("AGENT_TEMPDIRECTORY", env.agentTempDir)
    .inputApplicationInsightsInstrumentationKey()    
    .answerTerraformExists()
    .answerTerraformCommandIsSuccessful()
    .run();

