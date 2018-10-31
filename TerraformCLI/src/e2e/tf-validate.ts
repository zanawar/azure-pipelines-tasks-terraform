import { TaskMockRunner } from 'azure-pipelines-task-lib/mock-run';
import path from 'path';

var taskPath = require.resolve('./../index');
let taskRunner: TaskMockRunner = new TaskMockRunner(taskPath);
taskRunner.setInput("command", "validate");
taskRunner.setInput("workingDirectory", path.resolve("./../TerraformTemplates/sample"));
taskRunner.setInput("varsFile", path.resolve("./../TerraformTemplates/sample/default.vars"));
taskRunner.run(true);
