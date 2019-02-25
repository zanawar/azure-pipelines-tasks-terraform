import { AzRunner } from "./az-runner";
import { Step, StepFrom } from "./command-pipeline-step";
import { injectable, inject } from "inversify";
import { ThenFrom } from "./command-pipeline-then";
import { ICommand, IHandleCommand } from "./command-handler";

declare module "./command-pipeline-step" {
    interface Step<TResult> {
        azStorageContainerCreateFrom<TPreviousResult>(this: Step<TPreviousResult>, commandFactory: (previous: TPreviousResult) => AzStorageContainerCreate): StepFrom<TPreviousResult, AzStorageContainerCreateResult>;
    }
}

Step.prototype.azStorageContainerCreateFrom = function<TPreviousResult>(this: Step<TPreviousResult>, commandFactory: (previous: TPreviousResult) => AzStorageContainerCreate): StepFrom<TPreviousResult, AzStorageContainerCreateResult>{
    return new ThenFrom<TPreviousResult, AzStorageContainerCreate, AzStorageContainerCreateResult>(this, commandFactory);
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
    readonly accountKey: string;
    constructor(name: string, accountName: string, accountKey: string) {
        this.name = name;
        this.accountName = accountName;
        this.accountKey = accountKey;
    }

    toString() : string {
        return `storage container create --name ${this.name} --account-name ${this.accountName} --account-key ${this.accountKey}`;
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