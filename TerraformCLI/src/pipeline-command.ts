import { Step } from "./step";
import { IMediator } from "./mediator";
import { ICommand } from "./commands";

export class PipelineCommand<TCommand extends ICommand<TResult>, TResult> extends Step<TResult>
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

