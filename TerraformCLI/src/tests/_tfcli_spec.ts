import { TestScenario } from './assertions';
import './assertions-terraform';

describe('terraform', function(){    
    it('terraform does not exist', function(){
        new TestScenario('./terraform-not-exists')
            .assertExecutionFailed()
            .run();
    });
});

describe('terraform init', function(){
    it('no backend', function(){        
        new TestScenario('./init-with-backend-null')
            .assertExecutionSucceeded()
            .assertExecutedTerraformCommand("init")
            .assertExecutedTerraformVersion()
            .run();
    });
    it('invalid backend', function(){
        new TestScenario('./init-with-backend-invalid')
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
        new TestScenario('./init-with-backend-azurerm')
            .assertExecutionSucceeded()            
            .assertExecutedTerraformCommand(expectedCommand)
            .assertExecutedTerraformVersion()
            .run();
    });       
    it('azurerm backend with invalid auth scheme', function(){
        new TestScenario('./init-with-backend-azurerm-with-invalid-auth')
            .assertExecutionFailed()     
            .assertExecutedTerraformVersion()
            .run();
    });
});

describe('terraform validate', function(){
    it('no args', function(){        
        new TestScenario('./validate-with-no-args')
            .assertExecutionSucceeded()   
            .assertExecutedTerraformCommand("validate")
            .assertExecutedTerraformVersion()
            .run();
    });
    it('with var file', function(){
        let varFile = 'foo.vars';
        let terraformCommand = 'validate';
        let commandArgs = `-var-file=${varFile}`
        let expectedCommand = `${terraformCommand} ${commandArgs}`
        new TestScenario('./validate-with-var-file')
            .assertExecutionSucceeded()   
            .assertExecutedTerraformCommand(expectedCommand)
            .assertExecutedTerraformVersion()
            .run();
    });
});

describe('terraform plan', function(){
    it('azurerm', function(){    
        new TestScenario('./plan-azurerm')
            .assertExecutionSucceeded()   
            .assertExecutedTerraformCommand("plan")
            .assertExecutedTerraformVersion()
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    });
    it('azurerm with var file', function(){
        let varFile = 'foo.vars';
        let terraformCommand = 'plan';
        let commandArgs = `-var-file=${varFile}`
        let expectedCommand = `${terraformCommand} ${commandArgs}`
        new TestScenario('./plan-azurerm-with-var-file')
            .assertExecutionSucceeded()   
            .assertExecutedTerraformCommand(expectedCommand)
            .assertExecutedTerraformVersion()
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    });
    it('azurerm with invalid auth scheme', function(){
        new TestScenario('./plan-azurerm-with-invalid-auth-scheme')
            .assertExecutionFailed('Terraform only supports service principal authorization for azure')
            .assertExecutedTerraformVersion()
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    });
});

describe('terraform apply', function(){
    it('azurerm', function(){
        let terraformCommand = 'apply';
        let commandArgs = '-auto-approve'
        let expectedCommand = `${terraformCommand} ${commandArgs}`
        new TestScenario('./apply-azurerm')
            .assertExecutionSucceeded()   
            .assertExecutedTerraformCommand(expectedCommand)
            .assertExecutedTerraformVersion()
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    });
    it('azurerm with var file', function(){
        let varFile = 'foo.vars';
        let terraformCommand = 'apply';
        let commandArgs = `-auto-approve -var-file=${varFile}`
        let expectedCommand = `${terraformCommand} ${commandArgs}`
        new TestScenario('./apply-azurerm-with-var-file')
            .assertExecutionSucceeded()   
            .assertExecutedTerraformCommand(expectedCommand)
            .assertExecutedTerraformVersion()
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    });
    it('azurerm with invalid auth scheme', function(){
        new TestScenario('./apply-azurerm-with-invalid-auth-scheme')
            .assertExecutionFailed('Terraform only supports service principal authorization for azure')
            .assertExecutedTerraformVersion()
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    })
});