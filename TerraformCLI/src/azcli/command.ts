export interface ICommand<TResult> { }

export abstract class HandleCommand<TCommand extends ICommand<TResult>, TResult> {
    public abstract execute(command: TCommand) : TResult;
}