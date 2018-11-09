import ma = require('azure-pipelines-task-lib/mock-answer');
import { TaskMockRunner } from "azure-pipelines-task-lib/mock-run";
import { MockTestRunner } from 'azure-pipelines-task-lib/mock-test';

const outOfOrderException: string = "No given has been provided. 'and' cannot be executed before a given";
const outOfOrderAssertionException: string = "No then has been provided. 'and' cannot be executed before a then";

export class TaskScenario{
    readonly taskRunner: TaskMockRunner;
    readonly taskPath: string;
    readonly testPath: string;
    answers: TaskAnswerBuilder | undefined;
    inputs: TaskInputBuilder | undefined;
    endpoints: TaskEndpointBuilder | undefined;    
    
    constructor(testPath: string, taskPath: string = "./../index") {
        this.testPath = require.resolve(testPath);
        this.taskPath = require.resolve(taskPath);
        this.taskRunner = new TaskMockRunner(this.taskPath);
        this.answers = undefined;
        this.inputs = undefined;
        this.endpoints = undefined;
        
        //clear any environment vars set by the previous run
        Object.keys(process.env)
            .filter(key => key.startsWith("INPUT_"))
            .forEach(key => delete process.env[key]);
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

    public givenEndpoint(endpoints: TaskEndpointBuilder): TaskScenario {
        this.endpoints = endpoints;
        return this;
    }

    public whenTaskIsRun(): TaskScenarioAssertion {
        if(!this.inputs || !this.answers)
            throw "No scenario steps defined. Unable to execute scenario";
        
        let endpoints = <TaskEndpoint[]>[];
        if(this.endpoints){
            endpoints = this.endpoints.build();
        }
        let inputs = <any>this.inputs.build();
        let answers = this.answers.build(inputs);        

        endpoints.forEach((e) => {
            process.env[`ENDPOINT_AUTH_SCHEME_${e.name}`] = e.authScheme;
            for(var p in e.dataParameters){
                process.env[`ENDPOINT_DATA_${e.name}_${p.toUpperCase()}`] = e.dataParameters[p];
            }
            for(var p in e.authParameters){
                process.env[`ENDPOINT_AUTH_PARAMETER_${e.name}_${p.toUpperCase()}`] = e.authParameters[p];
            }
        });

        for(var i in inputs){
            this.taskRunner.setInput(i, inputs[i]);
        }    

        this.taskRunner.setAnswers(answers);        
        this.taskRunner.run();
        return new TaskScenarioAssertion(this.testPath, inputs, answers, this.taskRunner);
    }
}

export interface TaskInputs {
    command: string;
    workingDirectory: string;
    varsFile: string;
    backendType: string;
    backendServiceArm?: string;
    backendAzureRmResourceGroupName?: string;
    backendAzureRmStorageAccountName?: string;
    backendAzureRmContainerName?: string;
    backendAzureRmKey?: string;
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

export interface TaskEndpoint {
    name: string;
    authScheme: string;
    dataParameters: any;
    authParameters: any;
}

export abstract class TaskEndpointBuilder {
    abstract build(): TaskEndpoint[];
}

export abstract class TaskEndpointDecorator extends TaskEndpointBuilder {
    protected readonly builder: TaskEndpointBuilder;
    constructor(builder: TaskEndpointBuilder) {
        super();
        this.builder = builder;
    }
}

export interface TaskContext{
    inputs: TaskInputs;
    answers: ma.TaskLibAnswers;
    taskRunner: TaskMockRunner;
    testRunner: MockTestRunner;
}

export abstract class TaskAssertionBuilder{
    abstract run(context: TaskContext): void;
}

export abstract class TaskAssertionDecorator extends TaskAssertionBuilder{
    protected readonly builder: TaskAssertionBuilder;
    constructor(builder: TaskAssertionBuilder) {
        super();
        this.builder = builder;
    }
}

export class TaskScenarioAssertion{
    private readonly context: TaskContext;
    private readonly testPath: string;
    private assertions: TaskAssertionBuilder | undefined = undefined;    
    constructor(testPath:string, inputs: TaskInputs, answers: ma.TaskLibAnswers, taskRunner: TaskMockRunner) {
        this.testPath = testPath;
        this.context = <TaskContext>{
            inputs: inputs,
            answers: answers,
            taskRunner: taskRunner
        };
    }

    public thenAssert(assertion: TaskAssertionBuilder): TaskScenarioAssertion{
        this.assertions = assertion;
        return this;
    }

    public andAssert(assertion: (assertions: TaskAssertionBuilder) => TaskAssertionDecorator): TaskScenarioAssertion{
        if(!this.assertions)
            throw outOfOrderException
        this.assertions = assertion(this.assertions);
        return this;
    }

    public run(): void{        
        if(!this.assertions)
            throw "no assertions defined for scenario";       

        this.context.testRunner = new MockTestRunner(this.testPath);
        this.context.testRunner.run();
        this.assertions.run(this.context);
    }
}