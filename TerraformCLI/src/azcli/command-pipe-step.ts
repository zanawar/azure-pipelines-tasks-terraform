import { ICommand } from "./command";
import { Step, StepFrom } from "./step";
import { IAzureMediator } from "./mediator";

export class CommandPipeFromStep<TPreviousResult, TCommand extends ICommand<TResult>, TResult> extends StepFrom<TPreviousResult, TResult>
{
    private readonly commandFactory: (result: TPreviousResult) => TCommand;

    constructor(previous: Step<TPreviousResult>, commandFactory: (event: TPreviousResult) => TCommand) {
        super(previous);
        this.commandFactory = commandFactory;
    }

    execute(mediator: IAzureMediator): TResult {
        let previous = this.previous.execute(mediator);
        let command = this.commandFactory(previous);
        return mediator.execute(command);
    }
}

export class CommandPipeStep<TPreviousResult, TCommand extends ICommand<TResult>, TResult> extends StepFrom<TPreviousResult, TResult>
{
    private readonly command: TCommand;

    constructor(previous: Step<TPreviousResult>, command: TCommand) {
        super(previous);
        this.command = command;
    }

    execute(mediator: IAzureMediator): TResult {
        this.previous.execute(mediator);
        return mediator.execute(this.command);
    }
}