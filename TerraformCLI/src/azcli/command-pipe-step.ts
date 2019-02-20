import { ICommand } from "./command";
import { Step, StepFrom } from "./step";
import { IAzureMediator } from "./mediator";

export class CommandPipeFromStep<TPrevious, TCommand extends ICommand<TEvent>, TEvent> extends StepFrom<TPrevious, TEvent>
{
    private readonly commandFactory: (event: TPrevious) => TCommand;

    constructor(previous: Step<TPrevious>, commandFactory: (event: TPrevious) => TCommand) {
        super(previous);
        this.commandFactory = commandFactory;
    }

    execute(mediator: IAzureMediator): TEvent {
        let previous = this.previous.execute(mediator);
        let command = this.commandFactory(previous);
        return mediator.execute(command);
    }
}

export class CommandPipeStep<TPrevious, TCommand extends ICommand<TEvent>, TEvent> extends StepFrom<TPrevious, TEvent>
{
    private readonly command: TCommand;

    constructor(previous: Step<TPrevious>, command: TCommand) {
        super(previous);
        this.command = command;
    }

    execute(mediator: IAzureMediator): TEvent {
        this.previous.execute(mediator);
        return mediator.execute(this.command);
    }
}