import { ICommand } from "./command";
import { Step } from "./step";
import { IAzureMediator } from "./mediator";

export class CommandStep<TCommand extends ICommand<TEvent>, TEvent> extends Step<TEvent>
{
    private readonly command: TCommand;

    constructor(command: TCommand) {
        super();
        this.command = command;
    }

    execute(mediator: IAzureMediator): TEvent {
        return mediator.execute(this.command);
    }
}

