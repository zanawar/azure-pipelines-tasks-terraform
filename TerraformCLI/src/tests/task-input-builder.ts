import path from 'path';
import { TaskInputBuilder, TaskInputs, TaskInputDecorator } from "./task-scenario-builder";

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

export class TerraformAzureRmBackend extends TaskInputDecorator {    
    private readonly backendServiceArm: string;
    private readonly backendAzureRmResourceGroupName: string;
    private readonly backendAzureRmStorageAccountName: string;
    private readonly backendAzureRmContainerName: string;
    private readonly backendAzureRmKey: string;
    constructor(inputs: TaskInputBuilder, serviceName: string, storageAccountName: string, containerName: string, key: string, resourceGroupName: string) {
        super(inputs);
        this.backendServiceArm = serviceName;
        this.backendAzureRmStorageAccountName = storageAccountName;
        this.backendAzureRmContainerName = containerName;
        this.backendAzureRmKey = key;
        this.backendAzureRmResourceGroupName = resourceGroupName;
    }    
    build(): TaskInputs {
        var inputs = this.inputs.build();
        inputs.backendType = "azurerm";
        inputs.backendServiceArm = this.backendServiceArm;
        inputs.backendAzureRmStorageAccountName = this.backendAzureRmStorageAccountName;
        inputs.backendAzureRmContainerName = this.backendAzureRmContainerName;
        inputs.backendAzureRmKey = this.backendAzureRmKey;
        inputs.backendAzureRmResourceGroupName = this.backendAzureRmResourceGroupName;
        return inputs;
    }
}