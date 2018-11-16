import { TaskScenario } from '../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import '../scenarios-terraform'

export let validateWithNoArgs = new TaskScenario<TerraformInputs>()
    .inputTerraformCommand("validate")
    .inputTerraformVarsFile("foo.vars")
    .answerTerraformExists()
    .answerTerraformCommandIsSuccessful()
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .run();

