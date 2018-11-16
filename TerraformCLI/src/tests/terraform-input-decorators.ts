import { TaskInputsAre } from "./task-input-decorators";
import { TaskInputBuilder } from "./task-input-builder";
import path from 'path';
import { TaskScenario } from "./task-scenario-builder";

export interface TerraformInputs {
    command: string;
    workingDirectory: string;
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
    constructor(builder: TaskInputBuilder<TerraformInputs>, command: string, workingDirectory: string = "./../TerraformTemplates/sample") {
        let cwd = path.resolve(workingDirectory);
        super(builder, { 
            command: command,  
            workingDirectory: cwd,
            varsFile : cwd
        });
    }
}

export class VarsFileIs extends TaskInputsAre<TerraformInputs> {
    constructor(inputs: TaskInputBuilder<TerraformInputs>, varsFile: string) {
        super(inputs, {
            varsFile: varsFile
        });
    }
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

declare module "./task-scenario-builder"{
    interface TaskScenario<TInputs>{
        inputTerraformCommand(this: TaskScenario<TerraformInputs>, command: string, workingDirectory?: string): TaskScenario<TerraformInputs>;
        inputTerraformVarsFile(this: TaskScenario<TerraformInputs>, varsFile: string) : TaskScenario<TerraformInputs>;
        inputAzureRmBackend(this: TaskScenario<TerraformInputs>, serviceName: string, storageAccountName: string, containerName: string, key: string, resourceGroupName: string): TaskScenario<TerraformInputs>;
    }
}

TaskScenario.prototype.inputTerraformCommand = function(this: TaskScenario<TerraformInputs>, command: string, workingDirectory?: string): TaskScenario<TerraformInputs>{
    this.withInputDecorator((builder) => new TerraformCommandAndWorkingDirectory(builder, command, workingDirectory));
    return this;
}
TaskScenario.prototype.inputTerraformVarsFile = function(this: TaskScenario<TerraformInputs>, varsFile: string) : TaskScenario<TerraformInputs>{
    this.withInputDecorator((builder) => new VarsFileIs(builder, varsFile));
    return this;
}
TaskScenario.prototype.inputAzureRmBackend = function(this: TaskScenario<TerraformInputs>, serviceName: string, storageAccountName: string, containerName: string, key: string, resourceGroupName: string): TaskScenario<TerraformInputs>{
    this.withInputDecorator((builder) => new TerraformAzureRmBackend(builder, serviceName, storageAccountName, containerName, key, resourceGroupName));
    return this;
}