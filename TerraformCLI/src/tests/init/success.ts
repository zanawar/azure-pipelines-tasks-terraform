import ma = require('azure-pipelines-task-lib/mock-answer');
import { TaskMockRunner } from 'azure-pipelines-task-lib/mock-run';

var taskPath = require.resolve('./../../index');
let taskRunner: TaskMockRunner = new TaskMockRunner(taskPath);

taskRunner.setInput("command", "init");
taskRunner.setInput("workingDirectory", "./../TerraformTemplates/sample");
taskRunner.setAnswers(<ma.TaskLibAnswers>{
    which : {
        "terraform" : "C:\\terraform\\terraform.exe"
    }
});
taskRunner.run();

