import { TaskEndpointBuilder, TaskEndpoint } from "./task-scenario-builder";

export interface AzureRmServiceEndpointDataParameters{
    subscriptionId: string;
}

export interface AzureRmServiceEndpointAuthParameters {
    tenantId: string;
    servicePrincipalId: string;
    servicePrincipalKey: string;
}

export class TaskAzureRmServiceEndpoint extends TaskEndpointBuilder{
    private readonly name: string;
    private readonly authScheme: string;
    private readonly subscriptionId: string;
    private readonly tenantId: string;
    private readonly servicePrincipalId: string;
    private readonly servicePrincipalKey: string;    
    
    constructor(name: string, subscriptionId: string, tenantId: string, servicePrincipalId: string, servicePrincipalKey: string, authScheme: string = "ServicePrincipal") {
        super();
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