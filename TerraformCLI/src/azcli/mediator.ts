import { ICommand, HandleCommand } from "./command";
import { injectable, inject, Container } from "inversify";
export interface IAzureMediator
{
    execute<TCommand extends ICommand<TResult>, TResult>(command: TCommand): TResult;
}

@injectable()
export class AzureMediator implements IAzureMediator{    
    private readonly container: Container;
    constructor(
        @inject("container") container: Container
    ) {
        this.container = container;
    }
    execute<TCommand extends ICommand<TResult>, TResult>(command: TCommand): TResult {        
        let handler = this.container.getNamed<HandleCommand<TCommand, TResult>>(HandleCommand, command.constructor.name);
        return handler.execute(command);
    }
}