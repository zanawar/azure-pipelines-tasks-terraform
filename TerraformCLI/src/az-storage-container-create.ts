import { CommandRunner } from "./command-runner";
import { Step, StepFrom } from "./step";
import { injectable, inject } from "inversify";
import { CommandPipeFromStep } from "./command-pipe-step";
import { ICommand, IHandleCommand } from "./commands";

declare module "./step" {
    interface Step<TResult> {
        azStorageContainerCreateFrom<TPreviousResult>(this: Step<TPreviousResult>, commandFactory: (previous: TPreviousResult) => AzStorageContainerCreate): StepFrom<TPreviousResult, AzStorageContainerCreateResult>;
    }
}

Step.prototype.azStorageContainerCreateFrom = function<TPreviousResult>(this: Step<TPreviousResult>, commandFactory: (previous: TPreviousResult) => AzStorageContainerCreate): StepFrom<TPreviousResult, AzStorageContainerCreateResult>{
    return new CommandPipeFromStep<TPreviousResult, AzStorageContainerCreate, AzStorageContainerCreateResult>(this, commandFactory);
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
}

@injectable()
export class AzStorageContainerCreateHandler implements IHandleCommand<AzStorageContainerCreate, AzStorageContainerCreateResult>{
    private readonly cli: CommandRunner;

    constructor(
        @inject(CommandRunner) cli: CommandRunner) {
        this.cli = cli;
    }
    
    execute(command: AzStorageContainerCreate): AzStorageContainerCreateResult {
        return this.cli.execJson<AzStorageContainerCreateResult>(`storage container create --name ${command.name} --account-name ${command.accountName} --account-key ${command.accountKey}`);
    }    
}