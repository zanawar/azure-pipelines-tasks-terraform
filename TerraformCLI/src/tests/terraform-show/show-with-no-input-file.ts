import { TaskScenario } from '../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import '../scenarios-terraform';
import { env } from './show-with-no-input-file.env';

export let showWithNoArgs = new TaskScenario<TerraformInputs>()
    .inputTerraformCommand(env.terraformCommand)
    .inputTerrformShowCommand(env.inputFile)
    .inputApplicationInsightsInstrumentationKey()
    
    .answerTerraformExists()
    .answerTerraformCommandIsSuccessful(env.commandOptions, 0, "", env.stdout)
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .run();  