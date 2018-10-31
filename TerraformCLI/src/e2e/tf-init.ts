import { TaskMockRunner } from 'azure-pipelines-task-lib/mock-run';
import path from 'path';

var taskPath = require.resolve('./../index');
let taskRunner: TaskMockRunner = new TaskMockRunner(taskPath);
taskRunner.setInput("command", "init");
taskRunner.setInput("workingDirectory", path.resolve("./../TerraformTemplates/sample"));
taskRunner.run(true);
