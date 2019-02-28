import { AzRunner } from "./az-runner";
import { Step, StepFrom } from "./command-pipeline-step";
import { injectable, inject } from "inversify";
import { Then } from "./command-pipeline-then";
import { ICommand, IHandleCommand } from "./command-handler";

declare module "./command-pipeline-step" {
    interface Step<TResult> {
        azStorageContainerCreate<TPreviousResult>(this: Step<TPreviousResult>, command: AzStorageContainerCreate): StepFrom<TPreviousResult, AzStorageContainerCreateResult>;
    }
}

Step.prototype.azStorageContainerCreate = function<TPreviousResult>(this: Step<TPreviousResult>, command: AzStorageContainerCreate): StepFrom<TPreviousResult, AzStorageContainerCreateResult>{
    return new Then<TPreviousResult, AzStorageContainerCreate, AzStorageContainerCreateResult>(this, command);
}

export class AzStorageContainerCreateResult {
    readonly created: boolean;
    constructor(created: boolean) {
        this.created = created;
    }
}

export class AzStorageContainerCreate implements ICommand<AzStorageContainerCreateResult> {
    readonly name: string;
    readonly accountName: string;
    constructor(name: string, accountName: string) {
        this.name = name;
        this.accountName = accountName;
    }

    toString() : string {
        return `storage container create --name ${this.name} --account-name ${this.accountName}`;
    }
}

@injectable()
export class AzStorageContainerCreateHandler implements IHandleCommand<AzStorageContainerCreate, AzStorageContainerCreateResult>{
    private readonly cli: AzRunner;

    constructor(
        @inject(AzRunner) cli: AzRunner) {
        this.cli = cli;
    }
    
    execute(command: AzStorageContainerCreate): AzStorageContainerCreateResult {
        return this.cli.execJson<AzStorageContainerCreateResult>(command.toString());
    }    
}