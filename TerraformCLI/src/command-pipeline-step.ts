import { IMediator } from "./mediator";

export abstract class Step<TResult>
{
    abstract execute(mediator: IMediator): TResult;
}

export abstract class StepFrom<TPreviousResult, TResult> extends Step<TResult>
{
    protected readonly previous: Step<TPreviousResult>;

    constructor(previous: Step<TPreviousResult>) {
        super();
        this.previous = previous;
    }
}