import path from 'path';
import { TaskScenario, TaskInputBuilder, TaskInputsAre, TaskAnswerDecorator, TaskAnswerBuilder } from "./scenarios";
import { TaskLibAnswers, TaskLibAnswerExecResult } from 'azure-pipelines-task-lib/mock-answer';

declare module "./scenarios"{
    interface TaskScenario<TInputs>{
        inputTerraformCommand(this: TaskScenario<TerraformInputs>, command: string, options?: string, workingDirectory?: string): TaskScenario<TerraformInputs>;
        inputTerraformVarsFile(this: TaskScenario<TerraformInputs>, varsFile: string) : TaskScenario<TerraformInputs>;
        inputAzureRmBackend(this: TaskScenario<TerraformInputs>, serviceName: string, storageAccountName: string, containerName: string, key: string, resourceGroupName: string): TaskScenario<TerraformInputs>;
        answerTerraformExists(this: TaskScenario<TerraformInputs>, terraformExists?: boolean): TaskScenario<TerraformInputs>;
        answerTerraformCommandIsSuccessful(this: TaskScenario<TerraformInputs>, args?: string): TaskScenario<TerraformInputs>;
        answerTerraformCommandWithVarsFileAsWorkingDirFails(this: TaskScenario<TerraformInputs>): TaskScenario<TerraformInputs>;
    }
}

export interface TerraformInputs {
    command: string;
    workingDirectory: string;
    commandOptions?: string;
    varsFile: string;
    backendType: string;
    backendServiceArm?: string;
    backendAzureRmResourceGroupName?: string;
    backendAzureRmStorageAccountName?: string;
    backendAzureRmContainerName?: string;
    backendAzureRmKey?: string;
    environmentServiceName?: string;
}

export class TerraformCommandAndWorkingDirectory extends TaskInputsAre<TerraformInputs>{
    constructor(builder: TaskInputBuilder<TerraformInputs>, command: string, options?: string, workingDirectory: string = "./../TerraformTemplates/sample") {
        let cwd = path.resolve(workingDirectory);
        super(builder, {
            command: command,
            commandOptions: options,
            workingDirectory: cwd,
            varsFile: cwd,
        });
    }
}
TaskScenario.prototype.inputTerraformCommand = function(this: TaskScenario<TerraformInputs>, command: string, options?: string, workingDirectory?: string): TaskScenario<TerraformInputs>{
    this.inputFactory((builder) => new TerraformCommandAndWorkingDirectory(builder, command, options, workingDirectory));
    return this;
}

export class VarsFileIs extends TaskInputsAre<TerraformInputs> {
    constructor(inputs: TaskInputBuilder<TerraformInputs>, varsFile: string) {
        super(inputs, {
            varsFile: varsFile
        });
    }
}
TaskScenario.prototype.inputTerraformVarsFile = function(this: TaskScenario<TerraformInputs>, varsFile: string) : TaskScenario<TerraformInputs>{
    this.inputFactory((builder) => new VarsFileIs(builder, varsFile));
    return this;
}

export class TerraformAzureRmBackend extends TaskInputsAre<TerraformInputs> {    
    constructor(inputs: TaskInputBuilder<TerraformInputs>, serviceName: string, storageAccountName: string, containerName: string, key: string, resourceGroupName: string) {
        super(inputs, {
            backendType: "azurerm",
            backendServiceArm: serviceName,
            backendAzureRmStorageAccountName: storageAccountName,
            backendAzureRmContainerName: containerName,
            backendAzureRmKey: key,
            backendAzureRmResourceGroupName: resourceGroupName
        });
    }    
}
TaskScenario.prototype.inputAzureRmBackend = function(this: TaskScenario<TerraformInputs>, serviceName: string, storageAccountName: string, containerName: string, key: string, resourceGroupName: string): TaskScenario<TerraformInputs>{
    this.inputFactory((builder) => new TerraformAzureRmBackend(builder, serviceName, storageAccountName, containerName, key, resourceGroupName));
    return this;
}

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
TaskScenario.prototype.answerTerraformCommandWithVarsFileAsWorkingDirFails = function(this: TaskScenario<TerraformInputs>): TaskScenario<TerraformInputs>{
    this.answerFactory((builder) => new TerraformCommandWithVarsFileAsWorkingDirFails(builder));
    return this;
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
        if(inputs.varsFile && inputs.varsFile != inputs.workingDirectory && command.indexOf('-var-file') < 0){
            command = `${command} -var-file=${inputs.varsFile}`
        }       

        a.exec[command] = <TaskLibAnswerExecResult>{
            code : 0,
            stdout : `${inputs.command} successful`
        }
        return a;
    }
}
TaskScenario.prototype.answerTerraformCommandIsSuccessful = function(this: TaskScenario<TerraformInputs>, args?: string): TaskScenario<TerraformInputs>{
    this.answerFactory((builder) => new TerraformCommandIsSuccessful(builder, args));
    return this;
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
TaskScenario.prototype.answerTerraformExists = function(this: TaskScenario<TerraformInputs>, terraformExists?: boolean): TaskScenario<TerraformInputs>{
    this.answerFactory((builder) => new TerraformExists(builder, terraformExists));
    return this;
}






