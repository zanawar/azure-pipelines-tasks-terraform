import { TaskAnswerDecorator, TaskAnswerBuilder, TaskInputs } from "./task-scenario-builder";
import { TaskLibAnswers, TaskLibAnswerExecResult } from "azure-pipelines-task-lib/mock-answer";

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
    private readonly args: string | undefined;
    constructor(builder: TaskAnswerBuilder, args?: string) {
        super(builder);
        this.args = args;
    }
    build(inputs: TaskInputs): TaskLibAnswers {
        let a = this.builder.build(inputs);
        a.exec = a.exec || {};
        let command = `terraform ${inputs.command}`;
        if(this.args)
            command = `${command} ${this.args}`;

        a.exec[command] = <TaskLibAnswerExecResult>{
            code : 0,
            stdout : `${inputs.command} successful`
        }
        return a;
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