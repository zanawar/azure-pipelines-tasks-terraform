import { AzureCLI } from "../azure-cli";
import { Step, StepFrom } from "../step";
import { injectable, inject } from "inversify";
import { CommandPipeFromStep } from "../command-pipe-step";
import { ICommand, IHandleCommand } from "../../commands";

declare module "../step" {
    interface Step<TResult> {
        azStorageContainerCreateFrom<TPreviousResult>(this: Step<TPreviousResult>, commandFactory: (previous: TPreviousResult) => StorageContainerCreate): StepFrom<TPreviousResult, StorageContainerCreateResult>;
    }
}

Step.prototype.azStorageContainerCreateFrom = function<TPreviousResult>(this: Step<TPreviousResult>, commandFactory: (previous: TPreviousResult) => StorageContainerCreate): StepFrom<TPreviousResult, StorageContainerCreateResult>{
    return new CommandPipeFromStep<TPreviousResult, StorageContainerCreate, StorageContainerCreateResult>(this, commandFactory);
}

export class StorageContainerCreateResult {
    readonly created: boolean;
    constructor(created: boolean) {
        this.created = created;
    }
}

export class StorageContainerCreate implements ICommand<StorageContainerCreateResult> {
    readonly name: string;
    readonly accountName: string;
    readonly accountKey: string;
    constructor(name: string, accountName: string, accountKey: string) {
        this.name = name;
        this.accountName = accountName;
        this.accountKey = accountKey;
    }
}

@injectable()
export class StorageContainerCreateHandler implements IHandleCommand<StorageContainerCreate, StorageContainerCreateResult>{
    private readonly cli: AzureCLI;

    constructor(
        @inject(AzureCLI) cli: AzureCLI) {
        this.cli = cli;
    }
    
    execute(command: StorageContainerCreate): StorageContainerCreateResult {
        return this.cli.execJson<StorageContainerCreateResult>(`storage container create --name ${command.name} --account-name ${command.accountName} --account-key ${command.accountKey}`);
    }    
}