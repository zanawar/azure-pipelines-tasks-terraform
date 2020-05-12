import path from 'path';
import { TaskScenario, TaskInputBuilder, TaskInputsAre, TaskAnswerDecorator, TaskAnswerBuilder, TaskInputDecorator } from "./scenarios";
import { TaskLibAnswers, TaskLibAnswerExecResult } from 'azure-pipelines-task-lib/mock-answer';
import { getSecureFileName } from 'azure-pipelines-task-lib';
import { TaskCompletedEvent, TaskAgentSession } from 'azure-devops-node-api/interfaces/TaskAgentInterfaces';
import { AzLogin, AzLoginResult, AzSubscription, AzUser } from '../az-login';
import { ICommand } from '../command-handler';
import { BuildReason } from 'azure-devops-node-api/interfaces/BuildInterfaces';
import { TestResult2 } from 'azure-devops-node-api/interfaces/TestInterfaces';

declare module "./scenarios"{
    interface TaskScenario<TInputs>{
        inputTerraformCommand(this: TaskScenario<TerraformInputs>, command: string, options?: string, workingDirectory?: string): TaskScenario<TerraformInputs>;
        inputTerrformShowCommand(this: TaskScenario<TerraformInputs>, inputTargetPlanOrStateFilePath: string):TaskScenario<TerraformInputs>;
        inputTerraformSecureVarsFile(this: TaskScenario<TerraformInputs>, secureVarsFileId: string, secureVarsFileName: string) : TaskScenario<TerraformInputs>;
        inputAzureRmBackend(this: TaskScenario<TerraformInputs>, serviceName: string, storageAccountName: string, containerName: string, key: string, resourceGroupName: string): TaskScenario<TerraformInputs>;
        inputAzureRmEnsureBackend(this: TaskScenario<TerraformInputs>, resourceGroupLocation?: string, storageAccountSku?: string): TaskScenario<TerraformInputs>;
        inputApplicationInsightsInstrumentationKey(this: TaskScenario<TerraformInputs>, instrumentationKey?: string): TaskScenario<TerraformInputs>;
        answerTerraformExists(this: TaskScenario<TerraformInputs>, terraformExists?: boolean): TaskScenario<TerraformInputs>;
        answerTerraformCommandIsSuccessful(this: TaskScenario<TerraformInputs>, args?: string, exitCode?: number, stderr?: string, stdout?: String): TaskScenario<TerraformInputs>;
        answerTerraformCommandWithVarsFileAsWorkingDirFails(this: TaskScenario<TerraformInputs>): TaskScenario<TerraformInputs>;
        answerAzExists(this: TaskScenario<TerraformInputs>, azExists?: boolean): TaskScenario<TerraformInputs>;
        answerAzCommandIsSuccessfulWithResultRaw<TCommand extends ICommand<TResult>, TResult>(this: TaskScenario<TerraformInputs>, command: TCommand, result: string, warning?: string): TaskScenario<TerraformInputs>;
        answerAzCommandIsSuccessfulWithResult<TCommand extends ICommand<TResult>, TResult>(this: TaskScenario<TerraformInputs>, command: TCommand, result: TResult, warning?: string): TaskScenario<TerraformInputs>;
        answerAzCommandFailsWithErrorRaw<TCommand extends ICommand<TResult>, TResult>(this: TaskScenario<TerraformInputs>, command: TCommand, error: string): TaskScenario<TerraformInputs>;
    }
}

export interface TerraformInputs {
    command: string;
    workingDirectory: string;
    commandOptions?: string;
    varsFile: string;
    secureVarsFile: string;
    backendType: string;
    ensureBackend?: boolean;
    backendServiceArm?: string;
    backendAzureRmResourceGroupName?: string;
    backendAzureRmResourceGroupLocation?: string;
    backendAzureRmStorageAccountName?: string;
    backendAzureRmStorageAccountSku?: string;
    backendAzureRmContainerName?: string;
    backendAzureRmKey?: string;
    environmentServiceName?: string;
    aiInstrumentationKey?: string;
    environmentVariables: Map<string, string>;
    inputTargetPlanOrStateFilePath: string;
    resourceAddress: string;
    resourceId: string
}

export class TerraformAzureRmEnsureBackend extends TaskInputsAre<TerraformInputs>{
    constructor(builder: TaskInputBuilder<TerraformInputs>, resourceGroupLocation: string = "eastus", storageAccountSku: string = "Standard_RAGRS") {
        super(builder, {
            ensureBackend: true,
            backendAzureRmResourceGroupLocation: resourceGroupLocation,
            backendAzureRmStorageAccountSku: storageAccountSku
        });
    }
}
TaskScenario.prototype.inputAzureRmEnsureBackend = function(this: TaskScenario<TerraformInputs>, resourceGroupLocation?: string, storageAccountSku?: string): TaskScenario<TerraformInputs>{
    this.inputFactory((builder) => new TerraformAzureRmEnsureBackend(builder, resourceGroupLocation, storageAccountSku));
    return this;
}

export class TerraformApplicationInsightsInstrumentationKey extends TaskInputsAre<TerraformInputs>{
    constructor(builder: TaskInputBuilder<TerraformInputs>, instrumentationKey: string = "00000000-0000-0000-0000-000000000000") {
        super(builder, {
            aiInstrumentationKey: instrumentationKey
        });
    }
}
TaskScenario.prototype.inputApplicationInsightsInstrumentationKey = function(this: TaskScenario<TerraformInputs>, instrumentationKey?: string): TaskScenario<TerraformInputs>{
    this.inputFactory((builder) => new TerraformApplicationInsightsInstrumentationKey(builder, instrumentationKey));
    return this;
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

export class SecureVarsFileIs extends TaskInputDecorator<TerraformInputs> {    
    private readonly secureVarsFileId: string;
    private readonly secureVarsFileName: string;

    constructor(inputs: TaskInputBuilder<TerraformInputs>, secureVarsFileId: string, secureVarsFileName: string) {
        super(inputs);
        this.secureVarsFileId = secureVarsFileId;
        this.secureVarsFileName = secureVarsFileName;
    }
    build(): TerraformInputs {
        const inputs = this.inputs.build();
        inputs.secureVarsFile = this.secureVarsFileId;
        inputs.environmentVariables = inputs.environmentVariables || new Map<string, string>();
        inputs.environmentVariables.set(`SECUREFILE_NAME_${this.secureVarsFileId}`, this.secureVarsFileName);
        return inputs;
    }    
}
TaskScenario.prototype.inputTerraformSecureVarsFile = function(this: TaskScenario<TerraformInputs>, secureVarsFileId: string, secureVarsFileName: string) : TaskScenario<TerraformInputs>{
    this.inputFactory((builder) => new SecureVarsFileIs(builder, secureVarsFileId, secureVarsFileName));
    return this;
}

export class ShowVarsIs extends TaskInputDecorator<TerraformInputs> {
    private inputTargetPlanOrStateFilePath: string;

    constructor (inputs: TaskInputBuilder<TerraformInputs>, inputTargetPlanOrStateFilePath: string){
        super(inputs);
        this.inputTargetPlanOrStateFilePath = inputTargetPlanOrStateFilePath;
    }

    build (): TerraformInputs {
        const inputs = this.inputs.build();
        inputs.inputTargetPlanOrStateFilePath = this.inputTargetPlanOrStateFilePath;
        return inputs;
    }
}
TaskScenario.prototype.inputTerrformShowCommand = function (this: TaskScenario<TerraformInputs>, inputTargetPlanOrStateFilePath: string): TaskScenario<TerraformInputs>{
    this.inputFactory((builder) => new ShowVarsIs(builder, inputTargetPlanOrStateFilePath));
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
    private readonly exitCode: number | undefined;
    private readonly stderr: string | undefined;
    private readonly stdout:string | undefined;
    //update to add optional stdout , provide 
    constructor(builder: TaskAnswerBuilder<TerraformInputs>, args?: string, exitCode?: number, stderr?: string, stdout?:string) {
        super(builder);
        this.args = args;
        this.exitCode = exitCode;
        this.stderr = stderr;
        this.stdout = stdout;
    }
    build(inputs: TerraformInputs): TaskLibAnswers {
        let a = this.builder.build(inputs);
        a.exec = a.exec || {};
        let command = `terraform ${inputs.command}`;
        if(this.args)
            command = `${command} ${this.args}`;                  
        
        a.exec[command] = <TaskLibAnswerExecResult>{
            code : this.exitCode || 0,
            stdout : this.stdout || `${inputs.command} successful`,
            stderr : this.stderr,
        }
        return a;
    }
}
TaskScenario.prototype.answerTerraformCommandIsSuccessful = function(this: TaskScenario<TerraformInputs>, args?: string, exitCode?: number, stderr?: string, stdout?: string): TaskScenario<TerraformInputs>{
    this.answerFactory((builder) => new TerraformCommandIsSuccessful(builder, args, exitCode, stderr, stdout));
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

export class AzExists extends TaskAnswerDecorator<TerraformInputs>{
    private readonly azExists: boolean;
    constructor(builder: TaskAnswerBuilder<TerraformInputs>, azExists: boolean = true) {
        super(builder);
        this.azExists = azExists;
    }
    build(inputs: TerraformInputs): TaskLibAnswers {
        let a = this.builder.build(inputs);
        a.which = a.which || {};
        a.which["az"] = "az";
        a.checkPath = a.checkPath || {};
        a.checkPath["az"] = this.azExists;
        if(this.azExists){
            a.exec = a.exec || {};
            a.exec[`az --version`] = <TaskLibAnswerExecResult>{
                code : 0,
                stdout : `version successful`
            }
        }

        return a
    }
}
TaskScenario.prototype.answerAzExists = function(this: TaskScenario<TerraformInputs>, azExists?: boolean): TaskScenario<TerraformInputs>{
    this.answerFactory((builder) => new AzExists(builder, azExists));
    return this;
}

export class AzCommandIsSuccessfulWithResultRaw<TCommand extends ICommand<TResult>, TResult> extends TaskAnswerDecorator<TerraformInputs>{
    private readonly command: TCommand;
    private readonly result: string;
    private readonly warning: string;
    constructor(builder: TaskAnswerBuilder<TerraformInputs>, command: TCommand, result: string, warning: string = "") {
        super(builder);
        this.command = command;
        this.result = result;
        this.warning = warning;
    }
    build(inputs: TerraformInputs): TaskLibAnswers {
        let a = this.builder.build(inputs);        
        a.exec = a.exec || {};
        let command = `az ${this.command.toString()}`;
        a.exec[command] =  <TaskLibAnswerExecResult>{
            code: 0,
            stdout: this.result,
            stderr: this.warning
        }
        return a;
    }
}
TaskScenario.prototype.answerAzCommandIsSuccessfulWithResultRaw = function<TCommand extends ICommand<TResult>, TResult>(this: TaskScenario<TerraformInputs>, command: TCommand, result: string, warning: string = ""): TaskScenario<TerraformInputs>{    
    return this.answerFactory((builder) => new AzCommandIsSuccessfulWithResultRaw<TCommand, TResult>(builder, command, result, warning));
}

export class AzCommandIsSuccessfulWithResult<TCommand extends ICommand<TResult>, TResult> extends AzCommandIsSuccessfulWithResultRaw<TCommand, TResult>{
    constructor(builder: TaskAnswerBuilder<TerraformInputs>, command: TCommand, result: TResult, warning: string = "") {
        super(builder, (command), JSON.stringify(result), warning);
    }
}
TaskScenario.prototype.answerAzCommandIsSuccessfulWithResult = function<TCommand extends ICommand<TResult>, TResult>(this: TaskScenario<TerraformInputs>, command: TCommand, result: TResult, warning: string = ""): TaskScenario<TerraformInputs>{
    return this.answerFactory((builder) => new AzCommandIsSuccessfulWithResult<TCommand, TResult>(builder, command, result, warning));
}

export class AzCommandFailsWithErrorRaw<TCommand extends ICommand<TResult>, TResult> extends TaskAnswerDecorator<TerraformInputs>{
    private readonly command: TCommand;
    private readonly error: string;
    constructor(builder: TaskAnswerBuilder<TerraformInputs>, command: TCommand, error: string) {
        super(builder);
        this.command = command;
        this.error = error;
    }
    build(inputs: TerraformInputs): TaskLibAnswers {
        let a = this.builder.build(inputs);        
        a.exec = a.exec || {};
        let command = `az ${this.command.toString()}`;
        a.exec[command] =  <TaskLibAnswerExecResult>{
            code: 1,
            stdout: this.error,
            stderr: this.error
        }
        return a;
    }
}
TaskScenario.prototype.answerAzCommandFailsWithErrorRaw = function<TCommand extends ICommand<TResult>, TResult>(this: TaskScenario<TerraformInputs>, command: TCommand, error: string): TaskScenario<TerraformInputs>{    
    return this.answerFactory((builder) => new AzCommandFailsWithErrorRaw<TCommand, TResult>(builder, command, error));
}





