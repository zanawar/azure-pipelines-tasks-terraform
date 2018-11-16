import { TaskEndpointBuilder, TaskEndpoint, TaskEndpointDecorator } from "./task-endpoints-builder";
import { TaskScenario } from "./task-scenario-builder";

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

declare module "./task-scenario-builder"{
    interface TaskScenario<TInputs>{
        withAzureRmServiceEndpoint(this: TaskScenario<TInputs>, name: string, subscriptionId: string, tenantId: string, servicePrincipalId: string, servicePrincipalKey: string, authScheme?: string): TaskScenario<TInputs>;
    }
}

TaskScenario.prototype.withAzureRmServiceEndpoint = function<TInputs>(this: TaskScenario<TInputs>, name: string, subscriptionId: string, tenantId: string, servicePrincipalId: string, servicePrincipalKey: string, authScheme?: string): TaskScenario<TInputs>{
    this.withEndpointDecorator((builder) => new TaskAzureRmServiceEndpoint(builder, name, subscriptionId, tenantId, servicePrincipalId, servicePrincipalKey, authScheme));
    return this;
}