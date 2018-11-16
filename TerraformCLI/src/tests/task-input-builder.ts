export abstract class TaskInputBuilder<TInputs>{
    abstract build(): TInputs;
}

export class DefaultTaskInput<TInputs> extends TaskInputBuilder<TInputs>{
    build(): TInputs {
        return <TInputs>{};
    }
}

export abstract class TaskInputDecorator<TInputs> extends TaskInputBuilder<TInputs>{
    protected readonly inputs: TaskInputBuilder<TInputs>
    constructor(inputs: TaskInputBuilder<TInputs>) {
        super();
        this.inputs = inputs;
    }
}
