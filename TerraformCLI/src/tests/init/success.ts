import ma = require('azure-pipelines-task-lib/mock-answer');
import { TaskMockRunner } from 'azure-pipelines-task-lib/mock-run';

var taskPath = require.resolve('./../../index');
let taskRunner: TaskMockRunner = new TaskMockRunner(taskPath);

taskRunner.setInput("command", "init");
taskRunner.setInput("workingDirectory", "./../TerraformTemplates/sample");
taskRunner.setAnswers(<ma.TaskLibAnswers>{
    which : {
        "terraform" : "terraform"
    },
    exec : {
        "terraform version" : <ma.TaskLibAnswerExecResult>{
            code : 0,
            stdout : "Terraform v0.11.10"
        },
        "terraform init"  : <ma.TaskLibAnswerExecResult>{
            code : 0
        }
    }
});
taskRunner.run();

