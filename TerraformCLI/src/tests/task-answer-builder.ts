import ma = require('azure-pipelines-task-lib/mock-answer');

export abstract class TaskAnswerBuilder<TInputs>{
    abstract build(inputs: TInputs): ma.TaskLibAnswers;
}

export abstract class TaskAnswerDecorator<TInputs> extends TaskAnswerBuilder<TInputs>{
    protected readonly builder: TaskAnswerBuilder<TInputs>;
    constructor(builder: TaskAnswerBuilder<TInputs>) {
        super();
        this.builder = builder;
    }
}

export class DefaultTaskAnswer<TInputs> extends TaskAnswerBuilder<TInputs>{
    build(inputs: TInputs): ma.TaskLibAnswers {
        return <ma.TaskLibAnswers>{};
    }
}