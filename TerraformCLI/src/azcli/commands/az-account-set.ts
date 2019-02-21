import { IHandleCommand, ICommand } from "../../commands";
import { AzureCLI } from "../azure-cli";
import { Step, StepFrom } from "../step";
import { CommandPipeStep } from "../command-pipe-step";
import { injectable, inject } from "inversify";

declare module "../step" {
    interface Step<TResult> {
        azAccountSet<TPreviousResult>(this: Step<TPreviousResult>, command: AzAccountSet): StepFrom<TPreviousResult, AzAccountSetResult>;
    }
}

Step.prototype.azAccountSet = function<TPreviousResult>(this: Step<TPreviousResult>, command: AzAccountSet): StepFrom<TPreviousResult, AzAccountSetResult>{
    return new CommandPipeStep<TPreviousResult, AzAccountSet, AzAccountSetResult>(this, command);
}

export class AzAccountSetResult {
}

export class AzAccountSet implements ICommand<AzAccountSetResult> {
    readonly subscriptionId: string;
    constructor(subscriptionId: string) {
        this.subscriptionId = subscriptionId;
    }
}

@injectable()
export class AzAccountSetHandler implements IHandleCommand<AzAccountSet, AzAccountSetResult>{
    private readonly cli: AzureCLI;

    constructor(
        @inject(AzureCLI) cli: AzureCLI) {
        this.cli = cli;
    }
    
    execute(command: AzAccountSet): AzAccountSetResult {
        this.cli.exec(`account set -s "${command.subscriptionId}"`);
        return new AzAccountSetResult();
    }    
}