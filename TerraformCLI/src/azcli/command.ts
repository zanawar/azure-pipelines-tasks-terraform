export interface ICommand<TEvent> { }

export abstract class HandleCommand<TCommand extends ICommand<TEvent>, TEvent> {
    public abstract execute(command: TCommand) : TEvent;
}