import { Step, StepFrom } from "./command-pipeline-step";
import { ICommand } from "./command-handler";
import { IMediator } from "./mediator";

export class ThenFrom<TPreviousResult, TCommand extends ICommand<TResult>, TResult> extends StepFrom<TPreviousResult, TResult>
{
    private readonly commandFactory: (result: TPreviousResult) => TCommand;

    constructor(previous: Step<TPreviousResult>, commandFactory: (event: TPreviousResult) => TCommand) {
        super(previous);
        this.commandFactory = commandFactory;
    }

    execute(mediator: IMediator): TResult {
        let previous = this.previous.execute(mediator);
        let command = this.commandFactory(previous);
        return mediator.execute(command);
    }
}

export class Then<TPreviousResult, TCommand extends ICommand<TResult>, TResult> extends StepFrom<TPreviousResult, TResult>
{
    private readonly command: TCommand;

    constructor(previous: Step<TPreviousResult>, command: TCommand) {
        super(previous);
        this.command = command;
    }

    execute(mediator: IMediator): TResult {
        this.previous.execute(mediator);
        return mediator.execute(this.command);
    }
}