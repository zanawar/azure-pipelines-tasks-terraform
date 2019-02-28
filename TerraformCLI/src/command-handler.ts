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

export const CommandInterfaces = { 
    IHandleCommandString : Symbol("IHandleCommandString"),
    IHandleCommand: Symbol("IHandleCommand")
}