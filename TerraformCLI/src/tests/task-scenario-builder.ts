import { TaskMockRunner } from "azure-pipelines-task-lib/mock-run";
import { TaskInputBuilder, DefaultTaskInput, TaskInputDecorator } from './task-input-builder';
import { TaskEndpoint, TaskEndpointBuilder, DefaultTaskEndpoint, TaskEndpointDecorator } from './task-endpoints-builder';
import { TaskAnswerBuilder, DefaultTaskAnswer, TaskAnswerDecorator } from "./task-answer-builder";

export class TaskScenario<TInputs>{
    private readonly taskRunner: TaskMockRunner;
    public readonly taskPath: string;
    answers: TaskAnswerBuilder<TInputs>;
    inputs: TaskInputBuilder<TInputs>;
    endpoints: TaskEndpointBuilder;    
    
    constructor(taskPath: string = "./../index") {
        this.taskPath = require.resolve(taskPath);
        this.taskRunner = new TaskMockRunner(this.taskPath);
        this.answers = new DefaultTaskAnswer();
        this.inputs = new DefaultTaskInput<TInputs>();
        this.endpoints = new DefaultTaskEndpoint();
        
        //clear any environment vars set by the previous run
        Object.keys(process.env)
            .filter(key => key.startsWith("INPUT_"))
            .forEach(key => delete process.env[key]);
    }

    public withInputDecorator(input: (inputs: TaskInputBuilder<TInputs>) => TaskInputDecorator<TInputs>): TaskScenario<TInputs>{
        this.inputs = input(this.inputs);
        return this;
    }

    public withAnswerDecorator(answer: (answers: TaskAnswerBuilder<TInputs>) => TaskAnswerDecorator<TInputs>): TaskScenario<TInputs>{
        this.answers = answer(this.answers);
        return this;
    }

    public withEndpointDecorator(endpoint: (endpoints: TaskEndpointBuilder) => TaskEndpointDecorator): TaskScenario<TInputs>{
        this.endpoints = endpoint(this.endpoints);
        return this;
    }

    public run(): void {
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
    }
}