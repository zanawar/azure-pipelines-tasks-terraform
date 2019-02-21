import { IHandleCommand, ICommand } from "../../commands";
import { AzureCLI } from "../azure-cli";
import { Step, StepFrom } from "../step";
import { CommandPipeStep } from "../command-pipe-step";
import { injectable, inject } from "inversify";

declare module "../step" {
    interface Step<TResult> {
        azAccountSet<TPreviousResult>(this: Step<TPreviousResult>, command: AccountSet): StepFrom<TPreviousResult, AccountSetResult>;
    }
}

Step.prototype.azAccountSet = function<TPreviousResult>(this: Step<TPreviousResult>, command: AccountSet): StepFrom<TPreviousResult, AccountSetResult>{
    return new CommandPipeStep<TPreviousResult, AccountSet, AccountSetResult>(this, command);
}

export class AccountSetResult {
}

export class AccountSet implements ICommand<AccountSetResult> {
    readonly subscriptionId: string;
    constructor(subscriptionId: string) {
        this.subscriptionId = subscriptionId;
    }
}

@injectable()
export class SetAccountHandler implements IHandleCommand<AccountSet, AccountSetResult>{
    private readonly cli: AzureCLI;

    constructor(
        @inject(AzureCLI) cli: AzureCLI) {
        this.cli = cli;
    }
    
    execute(command: AccountSet): AccountSetResult {
        this.cli.exec(`account set -s "${command.subscriptionId}"`);
        return new AccountSetResult();
    }    
}