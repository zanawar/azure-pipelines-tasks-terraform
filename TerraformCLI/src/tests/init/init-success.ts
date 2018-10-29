import ma = require('azure-pipelines-task-lib/mock-answer');
import { TaskMockRunner } from 'azure-pipelines-task-lib/mock-run';
import path from 'path';

var taskPath = require.resolve('./../../index');
let taskRunner: TaskMockRunner = new TaskMockRunner(taskPath);
let workingDirectory = path.resolve("./../TerraformTemplates/sample");
taskRunner.setInput("command", "init");

// azure pipeline will set this to have the value of the working directory even if no value was provided
taskRunner.setInput("varsFile", workingDirectory);
taskRunner.setInput("workingDirectory", workingDirectory);

let a: ma.TaskLibAnswers = {
    which : {
        "terraform" : "terraform"
    },
    checkPath : {
        "terraform" : true
    },
    exec : {
        "terraform version" : <ma.TaskLibAnswerExecResult>{
            code : 0,
            stdout : "version successful"
        },
        "terraform init" : <ma.TaskLibAnswerExecResult>{
            code : 0,
            stdout : "init successful"
        }
    }
};
a.exec = a.exec || {};
a.exec[`terraform init -var-file=${workingDirectory}`] = <ma.TaskLibAnswerExecResult>{
    code : 1,
    stdout : "init failed. working dir provided to -var-file"
}
a.exec[`terraform init --var-file=${workingDirectory}`] = <ma.TaskLibAnswerExecResult>{
    code : 1,
    stdout : "init failed. working dir provided to --var-file"
}
taskRunner.setAnswers(a);
taskRunner.run();

