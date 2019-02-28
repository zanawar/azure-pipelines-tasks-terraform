import { injectable, Container, inject } from "inversify";
import { IHandleCommandString, CommandInterfaces, ICommand, IHandleCommand } from "./command-handler";

export interface IMediator {
    executeRawString(command: string): Promise<number>;
    execute<TCommand extends ICommand<TResult>, TResult>(command: TCommand): TResult
}

@injectable()
export class Mediator implements IMediator {
    private readonly container: Container;

    constructor(
        @inject("container") container: Container
    ) {
        this.container = container;
    }

    public async executeRawString(command: string): Promise<number> {
        let handler = this.container.getNamed<IHandleCommandString>(CommandInterfaces.IHandleCommandString, command);
        return await handler.execute(command);
    }

    public execute<TCommand extends ICommand<TResult>, TResult>(command: TCommand): TResult {
        let handler = this.container.getNamed<IHandleCommand<TCommand, TResult>>(CommandInterfaces.IHandleCommand, command.constructor.name);
        return handler.execute(command);
    }
}

export const MediatorInterfaces = {
    IMediator: Symbol("IMediator")
}