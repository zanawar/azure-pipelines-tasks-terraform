import ma = require('azure-pipelines-task-lib/mock-answer');
import { TaskMockRunner } from 'azure-pipelines-task-lib/mock-run';
import path from 'path';

var taskPath = require.resolve('./../index');
let taskRunner: TaskMockRunner = new TaskMockRunner(taskPath);
let workingDirectory = path.resolve("./../TerraformTemplates/sample");

taskRunner.setInput("command", "validate");
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
        "terraform validate" : <ma.TaskLibAnswerExecResult>{
            code : 0,
            stdout : "validate successful"
        }
    }
};
a.exec = a.exec || {};
a.exec[`terraform validate -var-file=${workingDirectory}`] = <ma.TaskLibAnswerExecResult>{
    code : 1,
    stdout : "validate failed. working directory provided to -var-file arg"
}
taskRunner.setAnswers(a);
taskRunner.run();

