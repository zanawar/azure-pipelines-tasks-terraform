import { ICommand, HandleCommand } from "./command";
import { injectable, inject, Container } from "inversify";
export interface IAzureMediator
{
    execute<TCommand extends ICommand<TEvent>, TEvent>(command: TCommand): TEvent;
}

@injectable()
export class AzureMediator implements IAzureMediator{    
    private readonly container: Container;
    constructor(
        @inject("container") container: Container
    ) {
        this.container = container;
    }
    execute<TCommand extends ICommand<TEvent>, TEvent>(command: TCommand): TEvent {        
        let handler = this.container.getNamed<HandleCommand<TCommand, TEvent>>(HandleCommand, command.constructor.name);
        return handler.execute(command);
    }
}