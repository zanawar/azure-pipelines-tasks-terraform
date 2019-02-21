export interface IHandleCommand{
    execute(command: string): Promise<number>;
}

export interface ICommand<TResult> { }

export interface IHandleCommandResult<TCommand extends ICommand<TResult>, TResult> {
    execute(command: TCommand) : TResult;
}

export const CommandInterfaces = { 
    IHandleCommand : Symbol("IHandleCommand"),
    IHandleCommandResult: Symbol("IHandleCommandResult")

}