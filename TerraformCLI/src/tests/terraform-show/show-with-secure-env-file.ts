import { TaskScenario } from '../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import { env } from './show-with-secure-env-file.env';
import '../scenarios-terraform'

new TaskScenario<TerraformInputs>()
    .inputTerraformCommand(env.terraformCommand)
    .inputTerrformShowCommand(env.inputFile)
    .inputTerraformSecureVarsFile(env.secureVarsFileId, env.secureVarsFileName)
    .inputApplicationInsightsInstrumentationKey()

    .answerTerraformExists()
    .answerTerraformCommandIsSuccessful(env.commandOptions, 0, "", env.stdout)
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .run();