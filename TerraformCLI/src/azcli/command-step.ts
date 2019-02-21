import { ICommand } from "./command";
import { Step } from "./step";
import { IAzureMediator } from "./mediator";

export class CommandStep<TCommand extends ICommand<TResult>, TResult> extends Step<TResult>
{
    private readonly command: TCommand;

    constructor(command: TCommand) {
        super();
        this.command = command;
    }

    execute(mediator: IAzureMediator): TResult {
        return mediator.execute(this.command);
    }
}

