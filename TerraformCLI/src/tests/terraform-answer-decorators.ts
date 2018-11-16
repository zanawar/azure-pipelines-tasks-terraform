import { TaskAnswerDecorator, TaskAnswerBuilder } from "./task-answer-builder";
import { TaskLibAnswers, TaskLibAnswerExecResult } from "azure-pipelines-task-lib/mock-answer";
import { TerraformInputs } from "./terraform-input-decorators";
import { TaskScenario } from "./task-scenario-builder";

export class TerraformCommandWithVarsFileAsWorkingDirFails extends TaskAnswerDecorator<TerraformInputs>{
    constructor(builder: TaskAnswerBuilder<TerraformInputs>) {
        super(builder);
    }
    build(inputs: TerraformInputs): TaskLibAnswers {
        let a = this.builder.build(inputs);
        a.exec = a.exec || {};
        a.exec[`terraform ${inputs.command} -var-file=${inputs.workingDirectory}`] = <TaskLibAnswerExecResult>{
            code : 1,
            stdout : "init failed. working dir provided to -var-file"
        }
        return a;
    }
}

export class TerraformCommandIsSuccessful extends TaskAnswerDecorator<TerraformInputs>{
    private readonly args: string | undefined;
    constructor(builder: TaskAnswerBuilder<TerraformInputs>, args?: string) {
        super(builder);
        this.args = args;
    }
    build(inputs: TerraformInputs): TaskLibAnswers {
        let a = this.builder.build(inputs);
        a.exec = a.exec || {};
        let command = `terraform ${inputs.command}`;
        if(this.args)
            command = `${command} ${this.args}`;
        if(inputs.varsFile && inputs.varsFile != inputs.workingDirectory){
            command = `${command} -var-file=${inputs.varsFile}`
        }       

        a.exec[command] = <TaskLibAnswerExecResult>{
            code : 0,
            stdout : `${inputs.command} successful`
        }
        return a;
    }
}

export class TerraformExists extends TaskAnswerDecorator<TerraformInputs>{
    private readonly terraformExists: boolean;
    constructor(builder: TaskAnswerBuilder<TerraformInputs>, terraformExists: boolean = true) {
        super(builder);
        this.terraformExists = terraformExists;
    }
    build(inputs: TerraformInputs): TaskLibAnswers {
        let a = this.builder.build(inputs);
        a.which = a.which || {};
        a.which["terraform"] = "terraform";
        a.checkPath = a.checkPath || {};
        a.checkPath["terraform"] = this.terraformExists;
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

declare module "./task-scenario-builder"{
    interface TaskScenario<TInputs>{
        answerTerraformExists(this: TaskScenario<TerraformInputs>, terraformExists?: boolean): TaskScenario<TerraformInputs>;
        answerTerraformCommandIsSuccessful(this: TaskScenario<TerraformInputs>, args?: string): TaskScenario<TerraformInputs>;
        answerTerraformCommandWithVarsFileAsWorkingDirFails(this: TaskScenario<TerraformInputs>): TaskScenario<TerraformInputs>;
    }
}

TaskScenario.prototype.answerTerraformExists = function(this: TaskScenario<TerraformInputs>, terraformExists?: boolean): TaskScenario<TerraformInputs>{
    this.withAnswerDecorator((builder) => new TerraformExists(builder, terraformExists));
    return this;
}

TaskScenario.prototype.answerTerraformCommandIsSuccessful = function(this: TaskScenario<TerraformInputs>, args?: string): TaskScenario<TerraformInputs>{
    this.withAnswerDecorator((builder) => new TerraformCommandIsSuccessful(builder, args));
    return this;
}

TaskScenario.prototype.answerTerraformCommandWithVarsFileAsWorkingDirFails = function(this: TaskScenario<TerraformInputs>): TaskScenario<TerraformInputs>{
    this.withAnswerDecorator((builder) => new TerraformCommandWithVarsFileAsWorkingDirFails(builder));
    return this;
}