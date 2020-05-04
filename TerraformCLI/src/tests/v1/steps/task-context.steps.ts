import { binding, given, then } from 'cucumber-tsflow';
import { expect } from 'chai';
import { MockTaskContext } from '../../../v1/context';
import { TableDefinition } from 'cucumber';
import { BackendTypes } from '../../../v1/backends';

@binding([MockTaskContext])
export class TaskContextSteps {
    constructor(private ctx: MockTaskContext) { }    
    
    @given("terraform command is {string}")
    public inputTerraformCommand(command: string){
        this.ctx.name = command;
    }

    @given("terraform command is {string} with options {string}")
    public inputTerraformCommandWithOptions(command: string, commandOptions: string){
        this.ctx.name = command;
        this.ctx.commandOptions = commandOptions;
    }

    @given("secure file specified with id {string} and name {string}")
    public inputTerraformSecureVarsFile(id: string, name: string){
        this.ctx.secureVarsFileId = id;
        this.ctx.secureVarsFileName = name;
        process.env[`SECUREFILE_NAME_${id}`] = name;
    }  
    
    @given("azurerm service connection {string} exists as")
    public inputAzureRmServiceEndpoint(backendServiceName: string, table: TableDefinition){
        var endpoint = table.rowsHash();        
        this.ctx.backendServiceArm = backendServiceName;
        this.ctx.backendServiceArmAuthorizationScheme = endpoint.scheme;
        this.ctx.backendServiceArmClientId = endpoint.clientId;
        this.ctx.backendServiceArmClientSecret = endpoint.clientSecret;
        this.ctx.backendServiceArmSubscriptionId = endpoint.subscriptionId;
        this.ctx.backendServiceArmTenantId = endpoint.tenantId;
    }

    @given("azurerm backend type selected with the following storage account")
    public inputAzureRmBackend(table: TableDefinition){
        var backend = table.rowsHash();
        this.ctx.backendType = BackendTypes.azurerm;
        this.ctx.backendAzureRmResourceGroupName = backend.resourceGroup;
        this.ctx.backendAzureRmStorageAccountName = backend.name;
        this.ctx.backendAzureRmContainerName = backend.container;
        this.ctx.backendAzureRmKey = backend.key;
    }

    @given("azurerm ensure backend is checked with the following")
    public inputAzureRmEnsureBackend(table: TableDefinition){
        const backend = table.rowsHash();
        this.ctx.ensureBackend = true;
        this.ctx.backendAzureRmResourceGroupLocation = backend.location;
        this.ctx.backendAzureRmStorageAccountSku = backend.sku
    }

    @then("pipeline variable {string} is set to {string}")
    public pipelineVariableIsSet(key: string, value: string){
        const variable = this.ctx.variables[key];
        expect(variable).to.not.be.undefined;
        if(variable){
            expect(variable.val).to.eq(value);
            expect(variable.secret).to.be.undefined;
        }
    }
}