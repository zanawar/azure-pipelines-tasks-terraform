import { HandleCommand } from "../command";
import { AzureCLI } from "../azure-cli";
import { Step, StepFrom } from "../step";
import { CommandPipeFromStep, CommandPipeStep } from "../command-pipe-step";
import { injectable, inject } from "inversify";

declare module "../step" {
    interface Step<TEvent> {
        azAccountSetFrom<TPrevious>(this: Step<TPrevious>, commandFactory: (previous: TPrevious) => SetAccount): StepFrom<TPrevious, AccountSet>;
        azAccountSet<TPrevious>(this: Step<TPrevious>, command: SetAccount): StepFrom<TPrevious, AccountSet>;
    }
}

Step.prototype.azAccountSetFrom = function<TPrevious>(this: Step<TPrevious>, commandFactory: (previous: TPrevious) => SetAccount): StepFrom<TPrevious, AccountSet>{
    return new CommandPipeFromStep<TPrevious, SetAccount, AccountSet>(this, commandFactory);
}
Step.prototype.azAccountSet = function<TPrevious>(this: Step<TPrevious>, command: SetAccount): StepFrom<TPrevious, AccountSet>{
    return new CommandPipeStep<TPrevious, SetAccount, AccountSet>(this, command);
}

export class AccountSet {
}

export class SetAccount {
    readonly subscriptionId: string;
    constructor(subscriptionId: string) {
        this.subscriptionId = subscriptionId;
    }
}

@injectable()
export class SetAccountHandler implements HandleCommand<SetAccount, AccountSet>{
    private readonly cli: AzureCLI;

    constructor(
        @inject(AzureCLI) cli: AzureCLI) {
        this.cli = cli;
    }
    
    execute(command: SetAccount): AccountSet {
        this.cli.exec(`account set -s "${command.subscriptionId}"`);
        return new AccountSet();
    }    
}