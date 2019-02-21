import { IHandleCommand, ICommand } from "./command-handler";
import { AzRunner } from "./az-runner";
import { Step, StepFrom } from "./command-pipeline-step";
import { Then } from "./command-pipeline-then";
import { injectable, inject } from "inversify";

declare module "./command-pipeline-step" {
    interface Step<TResult> {
        azAccountSet<TPreviousResult>(this: Step<TPreviousResult>, command: AzAccountSet): StepFrom<TPreviousResult, AzAccountSetResult>;
    }
}

Step.prototype.azAccountSet = function<TPreviousResult>(this: Step<TPreviousResult>, command: AzAccountSet): StepFrom<TPreviousResult, AzAccountSetResult>{
    return new Then<TPreviousResult, AzAccountSet, AzAccountSetResult>(this, command);
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
    private readonly cli: AzRunner;

    constructor(
        @inject(AzRunner) cli: AzRunner) {
        this.cli = cli;
    }
    
    execute(command: AzAccountSet): AzAccountSetResult {
        this.cli.exec(`account set -s "${command.subscriptionId}"`);
        return new AzAccountSetResult();
    }    
}