import { Step } from "./command-pipeline-step";
import { IMediator } from "./mediator";
import { ICommand } from "./command-handler";

export class Start<TCommand extends ICommand<TResult>, TResult> extends Step<TResult>
{
    private readonly command: TCommand;

    constructor(command: TCommand) {
        super();
        this.command = command;
    }

    execute(mediator: IMediator): TResult {
        return mediator.execute(this.command);
    }
}

