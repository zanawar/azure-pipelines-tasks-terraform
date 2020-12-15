import { TaskScenario } from '../scenarios';
import '../scenarios-terraform';
import { TerraformInputs } from '../scenarios-terraform';
import { env } from './show-with-eol-json.env';

export let showWithNoArgs = new TaskScenario<TerraformInputs>()
    .inputTerraformCommand(env.terraformCommand)
    .inputTerrformShowCommand(env.inputFile)
    .inputApplicationInsightsInstrumentationKey()
    
    .answerTerraformExists()
    .answerTerraformCommandIsSuccessful(env.commandOptions, 0, "", env.stdout)
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .run();  