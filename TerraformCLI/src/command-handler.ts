export interface IHandleCommandString{
    execute(command: string): Promise<number>;
}

export interface ICommand<TResult> 
{ 
    toString(): string;
}

export interface IHandleCommand<TCommand extends ICommand<TResult>, TResult> {
    execute(command: TCommand) : TResult;
}

export interface IHandleAsyncCommand<TCommand extends ICommand<TResult>, TResult> {
    execute(command: TCommand) : Promise<TResult>;
}

export const CommandInterfaces = { 
    IHandleCommandString : Symbol("IHandleCommandString"),
    IHandleCommand: Symbol("IHandleCommand"),
    IHandleAsyncCommand: Symbol("IHandleAsyncCommand")
}