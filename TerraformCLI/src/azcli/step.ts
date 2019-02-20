import { IAzureMediator } from "./mediator";

export abstract class Step<TEvent>
{
    abstract execute(mediator: IAzureMediator): TEvent;
}

export abstract class StepFrom<TPrevious, TEvent> extends Step<TEvent>
{
    protected readonly previous: Step<TPrevious>;

    constructor(previous: Step<TPrevious>) {
        super();
        this.previous = previous;
    }
}