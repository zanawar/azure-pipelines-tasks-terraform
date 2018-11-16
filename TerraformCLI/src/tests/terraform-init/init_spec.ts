import { TestScenario } from '../assertions';
import '../assertions-terraform';

describe('terraform init', function(){
    it('no backend', function(){        
        new TestScenario(require.resolve('./init-with-backend-null'))
            .assertExecutionSucceeded()
            .assertExecutedTerraformCommand("init")
            .assertExecutedTerraformVersion()
            .run();
    });
    it('invalid backend', function(){
        new TestScenario(require.resolve('./init-with-backend-invalid'))
            .assertExecutionSucceeded()
            .assertExecutedTerraformCommand("init")
            .assertExecutedTerraformVersion()
            .run();
    }); 
    it('azurerm backend', function(){
        const backendStorageAccountName: string = "storage";
        const backendContainerName: string = "container";
        const backendKey: string = "storageKey123";
        const backendResourceGroupName: string = "rg-backend-storage";
        const subscriptionId: string = "sub1";
        const tenantId: string = "ten1";
        const servicePrincipalId: string = "prin1";
        const servicePrincipalKey: string = "servicePrincipalKey123";

        const terraformCommand: string = "init";
        const terraformCommandArgs: string = `-backend-config=storage_account_name=${backendStorageAccountName} -backend-config=container_name=${backendContainerName} -backend-config=key=${backendKey} -backend-config=resource_group_name=${backendResourceGroupName} -backend-config=arm_subscription_id=${subscriptionId} -backend-config=arm_tenant_id=${tenantId} -backend-config=arm_client_id=${servicePrincipalId} -backend-config=arm_client_secret=${servicePrincipalKey}`
        const expectedCommand: string = `${terraformCommand} ${terraformCommandArgs}`;
        new TestScenario(require.resolve('./init-with-backend-azurerm'))
            .assertExecutionSucceeded()            
            .assertExecutedTerraformCommand(expectedCommand)
            .assertExecutedTerraformVersion()
            .run();
    });       
    it('azurerm backend with invalid auth scheme', function(){
        new TestScenario(require.resolve('./init-with-backend-azurerm-with-invalid-auth'))
            .assertExecutionFailed()     
            .assertExecutedTerraformVersion()
            .run();
    });
});