import { TaskScenario } from '../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import '../scenarios-terraform'
import { env } from './init-with-backend-azurerm-with-ensure-backend.env';
import { AzLogin, AzLoginResult } from '../../az-login';
import { AzAccountSet } from '../../az-account-set';
import { AzGroupCreate, AzGroupCreateResult } from '../../az-group-create';
import { AzStorageAccountCreate, AzStorageAccountCreateResult } from '../../az-storage-account-create';
import { AzStorageContainerCreate } from '../../az-storage-container-create';
import { AzStorageAccountKeysList, AzStorageAccountKey } from '../../az-storage-account-keys-list';

new TaskScenario<TerraformInputs>()
    .inputAzureRmServiceEndpoint(env.backendServiceName, env.subscriptionId, env.tenantId, env.servicePrincipalId, env.servicePrincipalKey)
    .inputTerraformCommand(env.terraformCommand)
    .inputAzureRmBackend(env.backendServiceName, env.backendStorageAccountName, env.backendContainerName, env.backendKey, env.backendResourceGroupName)
    .inputAzureRmEnsureBackend(env.backendResourceGroupLocation, env.backendStorageAccountSku)
    .answerTerraformExists()    
    .answerTerraformCommandIsSuccessful(env.commandArgs)
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .answerAzExists()
    .answerAzCommandIsSuccessfulWithResult(new AzLogin(env.tenantId, env.servicePrincipalId, env.servicePrincipalKey), <AzLoginResult>{ subscriptions: [] })
    .answerAzCommandIsSuccessfulWithResultRaw(new AzAccountSet(env.subscriptionId), "")
    .answerAzCommandIsSuccessfulWithResult(new AzGroupCreate(env.backendResourceGroupName, env.backendResourceGroupLocation), <AzGroupCreateResult>{})
    .answerAzCommandIsSuccessfulWithResult(new AzStorageAccountCreate(env.backendStorageAccountName, env.backendResourceGroupName, env.backendStorageAccountSku), <AzStorageAccountCreateResult>{})
    .answerAzCommandIsSuccessfulWithResultRaw(new AzStorageAccountKeysList(env.backendStorageAccountName, env.backendResourceGroupName), JSON.stringify([new AzStorageAccountKey("primary", "full", env.backendKey)]))
    .answerAzCommandIsSuccessfulWithResult(new AzStorageContainerCreate(env.backendContainerName, env.backendStorageAccountName), <AzStorageAccountCreateResult>{})
    .run()
