export interface ITaskContext {
    name: string;
    cwd: string;
    commandOptions?: string;
    secureVarsFileId: string;
    secureVarsFileName: string;
    backendType?: string;
    ensureBackend?: boolean;
    backendServiceArm: string;
    backendAzureRmResourceGroupName: string;
    backendAzureRmResourceGroupLocation: string;
    backendAzureRmStorageAccountName: string;
    backendAzureRmStorageAccountSku: string;
    backendAzureRmContainerName: string;
    backendAzureRmKey: string;
    backendServiceArmAuthorizationScheme: string;
    backendServiceArmSubscriptionId: string;
    backendServiceArmTenantId: string;
    backendServiceArmClientId: string;
    backendServiceArmClientSecret: string;
    environmentServiceName?: string;
    aiInstrumentationKey?: string;
    setVariable: (name: string, val: string, secret?: boolean | undefined) => void;
}

export { default as AzdoTaskContext } from './azdo-task-context';
export { default as MockTaskContext } from './mock-task-context';