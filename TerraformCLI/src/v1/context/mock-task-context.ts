import { ITaskContext } from ".";

export default class MockTaskContext implements ITaskContext {
    name: string = "";
    cwd: string = "";
    commandOptions?: string | undefined;
    secureVarsFileId: string = "";
    secureVarsFileName: string = "";
    backendType: string = "";
    ensureBackend?: boolean | undefined;
    backendServiceArm: string = "";
    backendAzureRmResourceGroupName: string = "";
    backendAzureRmResourceGroupLocation: string = "";
    backendAzureRmStorageAccountName: string = "";
    backendAzureRmStorageAccountSku: string = "";
    backendAzureRmContainerName: string = "";
    backendAzureRmKey: string = "";
    backendServiceArmAuthorizationScheme: string = "";
    backendServiceArmSubscriptionId: string = "";
    backendServiceArmTenantId: string = "";
    backendServiceArmClientId: string = "";
    backendServiceArmClientSecret: string = "";
    environmentServiceName?: string | undefined;
    aiInstrumentationKey?: string | undefined;

    public readonly variables: { [key: string]: { val: string, secret?: boolean }} = {};    

    public setVariable(name: string, val: string, secret?: boolean){
        this.variables[name] = { val, secret };
    }
}