import ma = require('azure-pipelines-task-lib/mock-answer');
import { TaskMockRunner } from "azure-pipelines-task-lib/mock-run";

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

export class TaskInputsAre<TInputs> extends TaskInputDecorator<TInputs>{
    private readonly partialInputs: any;
    constructor(builder: TaskInputBuilder<TInputs>, partialInputs: Partial<TInputs>) {
        super(builder);
        this.partialInputs = partialInputs;
    }
    build(): TInputs {
        let inputs: any = this.inputs.build();
        inputs = { ...inputs, ...this.partialInputs };        
        return inputs;
    }
}

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

export class DefaultTaskEndpoint extends TaskEndpointBuilder{
    build(): TaskEndpoint[] {
        return <TaskEndpoint[]>[];
    }
}

export interface AzureRmServiceEndpointDataParameters{
    subscriptionId: string;
}

export interface AzureRmServiceEndpointAuthParameters {
    tenantId: string;
    servicePrincipalId: string;
    servicePrincipalKey: string;
}

export class TaskAzureRmServiceEndpoint extends TaskEndpointDecorator{
    private readonly name: string;
    private readonly authScheme: string;
    private readonly subscriptionId: string;
    private readonly tenantId: string;
    private readonly servicePrincipalId: string;
    private readonly servicePrincipalKey: string;    
    
    constructor(builder: TaskEndpointBuilder, name: string, subscriptionId: string, tenantId: string, servicePrincipalId: string, servicePrincipalKey: string, authScheme: string = "ServicePrincipal") {
        super(builder);
        this.name = name;
        this.authScheme = authScheme;
        this.subscriptionId = subscriptionId;
        this.tenantId = tenantId;
        this.servicePrincipalId = servicePrincipalId;
        this.servicePrincipalKey = servicePrincipalKey;
    }
    build(): TaskEndpoint[] {
        let endpoint = <TaskEndpoint>{
            name:  this.name,
            authScheme: this.authScheme,
            dataParameters: <AzureRmServiceEndpointDataParameters>{
                subscriptionId: this.subscriptionId
            },
            authParameters: <AzureRmServiceEndpointAuthParameters>{
                tenantId: this.tenantId,
                servicePrincipalId: this.servicePrincipalId,
                servicePrincipalKey: this.servicePrincipalKey
            }            
        };

        return <TaskEndpoint[]>[endpoint];
    }    
}

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

    public inputFactory(input: (inputs: TaskInputBuilder<TInputs>) => TaskInputDecorator<TInputs>): TaskScenario<TInputs>{
        this.inputs = input(this.inputs);
        return this;
    }

    public input(inputs: Partial<TInputs>): TaskScenario<TInputs>{
        this.inputFactory((builder) => new TaskInputsAre(builder, inputs));
        return this;
    }

    public answerFactory(answer: (answers: TaskAnswerBuilder<TInputs>) => TaskAnswerDecorator<TInputs>): TaskScenario<TInputs>{
        this.answers = answer(this.answers);
        return this;
    }

    public endpointFactory(endpoint: (endpoints: TaskEndpointBuilder) => TaskEndpointDecorator): TaskScenario<TInputs>{
        this.endpoints = endpoint(this.endpoints);
        return this;
    }

    public inputAzureRmServiceEndpoint(name: string, subscriptionId: string, tenantId: string, servicePrincipalId: string, servicePrincipalKey: string, authScheme?: string): TaskScenario<TInputs>{
        this.endpointFactory((builder) => new TaskAzureRmServiceEndpoint(builder, name, subscriptionId, tenantId, servicePrincipalId, servicePrincipalKey, authScheme));
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
            if(inputs[i])
                this.taskRunner.setInput(i, inputs[i]);
        }    

        this.taskRunner.setAnswers(answers);        
        this.taskRunner.run();
    }
}