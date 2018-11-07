import { TaskInputBuilder, TaskInputs, TaskInputDecorator, TaskAnswerBuilder, TaskAnswerDecorator } from "./task-scenario-builder";
import path from 'path';
import { TaskLibAnswers, TaskLibAnswerExecResult } from "azure-pipelines-task-lib/mock-answer";

export class TerraformCommandAndWorkingDirectory extends TaskInputBuilder{
    private readonly workingDirectory: string;
    private readonly command: string;
    constructor(command: string, workingDirectory: string = "./../TerraformTemplates/sample") {
        super();
        this.command = command;
        this.workingDirectory = workingDirectory;
    }
    build(): TaskInputs {
        let cwd = path.resolve(this.workingDirectory);
        let inputs = <TaskInputs>{
            command: this.command,
            workingDirectory: cwd,
            // az devops will set this to the working directory since its a file path type input
            varsFile: cwd
        };
        return inputs;
    }
}

export class TerraformCommandWithVarsFileAsWorkingDirFails extends TaskAnswerDecorator{
    constructor(builder: TaskAnswerBuilder) {
        super(builder);
    }
    build(inputs: TaskInputs): TaskLibAnswers {
        let a = this.builder.build(inputs);
        a.exec = a.exec || {};
        a.exec[`terraform ${inputs.command} -var-file=${inputs.workingDirectory}`] = <TaskLibAnswerExecResult>{
            code : 1,
            stdout : "init failed. working dir provided to -var-file"
        }
        return a;
    }
}

export class TerraformCommandIsSuccessful extends TaskAnswerDecorator{
    constructor(builder: TaskAnswerBuilder) {
        super(builder);
    }
    build(inputs: TaskInputs): TaskLibAnswers {
        let a = this.builder.build(inputs);
        a.exec = a.exec || {};
        a.exec[`terraform ${inputs.command}`] = <TaskLibAnswerExecResult>{
            code : 0,
            stdout : `${inputs.command} successful`
        }
        return a;
    }
}

export class TaskInputIs extends TaskInputDecorator{
    private readonly setter: (inputs: TaskInputs) => void;
    constructor(inputs: TaskInputBuilder, setter: (inputs: TaskInputs)=>void) {
        super(inputs);
        this.setter = setter;
    }
    build(): TaskInputs {
        let inputs = this.inputs.build();
        this.setter(inputs);
        return inputs;
    }
}

export class VarsFileIs extends TaskInputIs {
    constructor(inputs: TaskInputBuilder, varsFile: string) {
        super(inputs, (i) => { i.varsFile = varsFile });
    }
}

export class TerraformExists extends TaskAnswerBuilder{
    private readonly terraformExists: boolean;
    constructor(terraformExists: boolean = true) {
        super();
        this.terraformExists = terraformExists;
    }
    build(inputs: TaskInputs): TaskLibAnswers {
        let a: TaskLibAnswers = {
            which : {
                "terraform" : "terraform"
            },
            checkPath : {
                terraform : this.terraformExists
            }
        }

        if(this.terraformExists){
            a.exec = a.exec || {};
            a.exec[`terraform version`] = <TaskLibAnswerExecResult>{
                code : 0,
                stdout : `version successful`
            }
        }

        return a;
    }
}