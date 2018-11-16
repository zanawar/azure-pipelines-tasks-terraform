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