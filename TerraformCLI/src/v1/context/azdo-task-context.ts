import { ITaskContext } from ".";
import * as tasks from 'azure-pipelines-task-lib/task';

export default class AzdoTaskContext implements ITaskContext {
    private getInput: (name: string, required?: boolean | undefined) => string;
    private getBoolInput: (name: string, required?: boolean | undefined) => boolean;
    private getEndpointAuthorizationScheme: (id: string, optional: boolean) => string;
    private getEndpointDataParameter: (id: string, key: string, optional: boolean) => string;
    private getEndpointAuthorizationParameter: (id: string, key: string, optional: boolean) => string;
    private getSecureFileName: (id: string) => string;
    public setVariable: (name: string, val: string, secret?: boolean | undefined) => void;
    constructor() {
        this.getInput = tasks.getInput;
        this.getBoolInput = tasks.getBoolInput;
        this.getEndpointAuthorizationScheme = tasks.getEndpointAuthorizationScheme;
        this.getEndpointDataParameter = tasks.getEndpointDataParameter;
        this.getEndpointAuthorizationParameter = tasks.getEndpointAuthorizationParameter;
        this.setVariable = tasks.setVariable;
        this.getSecureFileName = tasks.getSecureFileName;
    }
    get name() {
        return this.getInput("command");
    }
    get cwd() {
        return this.getInput("workingDirectory");
    }
    get commandOptions() {
        return this.getInput("commandOptions");
    }
    get secureVarsFileId() {
        return this.getInput("secureVarsFileId");
    }
    get secureVarsFileName() {
        return this.getSecureFileName(this.secureVarsFileId);
    }
    get backendType() {
        return this.getInput("backendType");
    }
    get ensureBackend() {
        return this.getBoolInput("ensureBackend");
    }
    get backendServiceArm() {
        return this.getInput("backendServiceArm", true);
    }
    get backendAzureRmResourceGroupName() {
        return this.getInput("backendAzureRmResourceGroupName", true);
    }
    get backendAzureRmResourceGroupLocation() {
        return this.getInput("backendAzureRmResourceGroupLocation", true);
    }
    get backendAzureRmStorageAccountName() {
        return this.getInput("backendAzureRmStorageAccountName", true);
    }
    get backendAzureRmStorageAccountSku() {
        return this.getInput("backendAzureRmStorageAccountSku", true);
    }
    get backendAzureRmContainerName() {
        return this.getInput("backendAzureRmContainerName", true);
    }
    get backendAzureRmKey() {
        return this.getInput("backendAzureRmKey", true);
    }
    get backendServiceArmAuthorizationScheme() {
        return this.getEndpointAuthorizationScheme(this.backendServiceArm, true);
    }
    get backendServiceArmSubscriptionId() {
        return this.getEndpointDataParameter(this.backendServiceArm, "subscriptionid", true);
    }
    get backendServiceArmTenantId() {
        return this.getEndpointAuthorizationParameter(this.backendServiceArm, "tenantid", true);
    }
    get backendServiceArmClientId() {
        return this.getEndpointAuthorizationParameter(this.backendServiceArm, "serviceprincipalid", true);
    }
    get backendServiceArmClientSecret() {
        return this.getEndpointAuthorizationParameter(this.backendServiceArm, "serviceprincipalkey", true);
    }
    get environmentServiceName() {
        return this.getInput("environmentServiceName");
    }
    get aiInstrumentationKey() {
        return this.getInput("aiInstrumentationKey");
    }
}