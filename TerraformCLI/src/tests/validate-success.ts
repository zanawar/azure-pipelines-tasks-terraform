import { TaskScenario } from './task-scenario-builder';
import { 
    TerraformExists, 
    TerraformCommandAndWorkingDirectory, 
    TerraformCommandIsSuccessful, 
    TerraformCommandWithVarsFileAsWorkingDirFails 
} from './any-steps';

let scenario = new TaskScenario()
    .givenInput(new TerraformCommandAndWorkingDirectory(("validate")))    
    
    .givenAnswer(new TerraformExists())
    .andAnswer((answers) => new TerraformCommandIsSuccessful(answers))
    .andAnswer((answers) => new TerraformCommandWithVarsFileAsWorkingDirFails(answers))

    .run();

