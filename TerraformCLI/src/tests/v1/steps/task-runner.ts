import TaskAgentMock from "../../../task-agent-mock";
import * as ma from "azure-pipelines-task-lib/mock-answer";
import MockToolFactory, { setAnswers } from "../../../v1/runners/mock-tool-factory";
import { AzdoRunner } from "../../../v1/runners";
import { Task } from "../../../v1/task";
import { CommandResponse } from "../../../v1/commands";
import { ITaskContext } from "../../../v1/context";
import intercept from 'intercept-stdout';

export default class TaskRunner {
    error?: Error;
    response?: CommandResponse;
    logs: string[] = [];

    constructor() {        
    }

    public async run(taskContext: ITaskContext, taskAnswers: ma.TaskLibAnswers) {        
        const toolFactory = new MockToolFactory();
        const taskAgent = new TaskAgentMock()
        const runner = new AzdoRunner(toolFactory);
        const task = new Task(taskContext, runner, taskAgent);
        setAnswers(taskAnswers);
        try{
            //separate the stdout from task and cucumbers test
            const unhook_intercept = intercept((text) => {
                this.logs.push(text);
                return '';
            })
            this.response = await task.exec();
            unhook_intercept();
        }
        catch(error){
            this.error = error;
        }
    }
}