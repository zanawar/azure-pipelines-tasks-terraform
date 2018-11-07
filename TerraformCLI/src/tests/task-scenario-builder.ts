import ma = require('azure-pipelines-task-lib/mock-answer');
import { TaskMockRunner } from "azure-pipelines-task-lib/mock-run";

const outOfOrderException: string = "No given has been provided. 'and' cannot be executed before a given";

export class TaskScenario{
    readonly taskRunner: TaskMockRunner;
    readonly taskPath: string;
    answers: TaskAnswerBuilder | undefined;
    inputs: TaskInputBuilder | undefined;
    
    constructor(taskPath: string = "./../index") {
        this.taskPath = require.resolve(taskPath);
        this.taskRunner = new TaskMockRunner(this.taskPath);
        this.answers = undefined;
        this.inputs = undefined;
    }

    public givenAnswer(answers: TaskAnswerBuilder): TaskScenario {
        this.answers = answers;
        return this;
    }

    public andAnswer(answer: (answers: TaskAnswerBuilder) => TaskAnswerDecorator): TaskScenario {
        if(!this.answers)
            throw outOfOrderException
        this.answers = answer(this.answers);
        return this;
    }

    public givenInput(inputs: TaskInputBuilder): TaskScenario {
        this.inputs = inputs
        return this;
    }

    public andInput(input: (inputs: TaskInputBuilder) => TaskInputDecorator): TaskScenario {        
        if(!this.inputs)
            throw outOfOrderException
        this.inputs = input(this.inputs);
        return this;
    }

    public run(): void {
        if(!this.inputs || !this.answers)
            throw "No scenario steps defined. Unable to execute scenario";
        let inputs = <any>this.inputs.build();
        let answers = this.answers.build(inputs);

        for(var i in inputs){
            this.taskRunner.setInput(i, inputs[i]);
        }        
        this.taskRunner.setAnswers(answers);        
        this.taskRunner.run();
    }
}

export interface TaskInputs {
    command: string;
    workingDirectory: string;
    varsFile: string;
}

export abstract class TaskInputBuilder{
    abstract build(): TaskInputs;
}

export abstract class TaskInputDecorator extends TaskInputBuilder{
    protected readonly inputs: TaskInputBuilder
    constructor(inputs: TaskInputBuilder) {
        super();
        this.inputs = inputs;
    }
}

export abstract class TaskAnswerBuilder{
    abstract build(inputs: TaskInputs): ma.TaskLibAnswers;
}

export abstract class TaskAnswerDecorator extends TaskAnswerBuilder{
    protected readonly builder: TaskAnswerBuilder;
    constructor(builder: TaskAnswerBuilder) {
        super();
        this.builder = builder;
    }
}