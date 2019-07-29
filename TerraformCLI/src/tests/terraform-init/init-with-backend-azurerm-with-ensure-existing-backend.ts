import { TaskScenario } from '../scenarios';
import { TerraformInputs } from '../scenarios-terraform';
import '../scenarios-terraform'
import { env } from './init-with-backend-azurerm-with-ensure-existing-backend.env';
import { AzLogin, AzLoginResult } from '../../az-login';
import { AzAccountSet } from '../../az-account-set';
import { AzGroupCreate, AzGroupCreateResult } from '../../az-group-create';
import { AzStorageAccountCreate, AzStorageAccountCreateResult, AzStorageAccountShow, AzStorageAccountShowResult } from '../../az-storage-account-create';
import { AzStorageContainerCreate } from '../../az-storage-container-create';

new TaskScenario<TerraformInputs>()
    .inputAzureRmServiceEndpoint(env.backendServiceName, env.subscriptionId, env.tenantId, env.servicePrincipalId, env.servicePrincipalKey)
    .inputTerraformCommand(env.terraformCommand)
    .inputAzureRmBackend(env.backendServiceName, env.backendStorageAccountName, env.backendContainerName, env.backendKey, env.backendResourceGroupName)
    .inputAzureRmEnsureBackend(env.backendResourceGroupLocation, env.backendStorageAccountSku)    
    .inputApplicationInsightsInstrumentationKey()
    .answerTerraformExists()    
    .answerTerraformCommandIsSuccessful(env.commandArgs)
    .answerTerraformCommandWithVarsFileAsWorkingDirFails()
    .answerAzExists()
    .answerAzCommandIsSuccessfulWithResult(new AzLogin(env.tenantId, env.servicePrincipalId, env.servicePrincipalKey), <AzLoginResult>{ subscriptions: [] })
    .answerAzCommandIsSuccessfulWithResultRaw(new AzAccountSet(env.subscriptionId), "")
    .answerAzCommandIsSuccessfulWithResult(new AzGroupCreate(env.backendResourceGroupName, env.backendResourceGroupLocation), <AzGroupCreateResult>{})
    .answerAzCommandIsSuccessfulWithResult(new AzStorageAccountShow(env.backendStorageAccountName, env.backendResourceGroupName), <AzStorageAccountShowResult>{
        id : `/subscriptions/${env.subscriptionId}/resourceGroups/${env.backendResourceGroupName}/providers/Microsoft.Storage/storageAccounts/${env.backendStorageAccountName}`,
        name : env.backendStorageAccountName,
        location : env.backendResourceGroupLocation
    })
    .answerAzCommandFailsWithErrorRaw(new AzStorageAccountCreate(env.backendStorageAccountName, env.backendResourceGroupName, env.backendStorageAccountSku), "Values for request parameters are invalid: kind.")
    .answerAzCommandIsSuccessfulWithResult(new AzStorageContainerCreate(env.backendContainerName, env.backendStorageAccountName), <AzStorageAccountCreateResult>{})
    .run()
