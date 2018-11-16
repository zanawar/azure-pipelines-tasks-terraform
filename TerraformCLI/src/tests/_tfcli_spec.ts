import { TaskScenarioAssertion } from './task-scenario-builder';
import { TaskExecutionFailed, TaskExecutionSucceeded, TaskExecutedCommand, TaskExecutedTerraformVersion, TaskExecutedTerraformCommand } from './task-assertion-builder';

describe('terraform', function(){    
    it('terraform does not exist', function(){
        new TaskScenarioAssertion('./terraform-not-exists')
            .thenAssert(new TaskExecutionFailed())
            .run();
    });
});

describe('terraform init', function(){
    it('no backend', function(){        
        new TaskScenarioAssertion('./init-with-backend-null')
            .thenAssert(new TaskExecutionSucceeded())
            .andAssert((assertions) => new TaskExecutedCommand(assertions, "terraform init"))
            .andAssert((assertions) => new TaskExecutedTerraformVersion(assertions))
            .run();
    });
    it('invalid backend', function(){
        new TaskScenarioAssertion('./init-with-backend-invalid')
            .thenAssert(new TaskExecutionSucceeded())
            .andAssert((assertions) => new TaskExecutedCommand(assertions, "terraform init"))
            .andAssert((assertions) => new TaskExecutedTerraformVersion(assertions))
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
        const expectedCommand: string = `terraform ${terraformCommand} ${terraformCommandArgs}`;
        new TaskScenarioAssertion('./init-with-backend-azurerm')
            .thenAssert(new TaskExecutionSucceeded())
            .andAssert((assertions) => new TaskExecutedCommand(assertions, expectedCommand))
            .andAssert((assertions) => new TaskExecutedTerraformVersion(assertions))
            .run();
    });       
    it('azurerm backend with invalid auth scheme', function(){
        new TaskScenarioAssertion('./init-with-backend-azurerm-with-invalid-auth')
            .thenAssert(new TaskExecutionFailed())
            .andAssert((assertions) => new TaskExecutedTerraformVersion(assertions))
            .run();
    });
});

describe('terraform validate', function(){
    it('no args', function(){        
        new TaskScenarioAssertion('./validate-with-no-args')
            .thenAssert(new TaskExecutionSucceeded())
            .andAssert((assertions) => new TaskExecutedCommand(assertions, "terraform validate"))
            .andAssert((assertions) => new TaskExecutedTerraformVersion(assertions))
            .run();
    });
    it('with var file', function(){
        let varFile = 'foo.vars';
        let terraformCommand = 'validate';
        let commandArgs = `-var-file=${varFile}`
        let expectedCommand = `${terraformCommand} ${commandArgs}`
        new TaskScenarioAssertion('./validate-with-var-file')
            .thenAssert(new TaskExecutionSucceeded())
            .andAssert((assertions) => new TaskExecutedTerraformCommand(assertions, expectedCommand))
            .andAssert((assertions) => new TaskExecutedTerraformVersion(assertions))
            .run();
    });
});

describe('terraform plan', function(){
    it('azurerm', function(){    
        new TaskScenarioAssertion('./plan-azurerm')
            .thenAssert(new TaskExecutionSucceeded())
            .andAssert((assertions) => new TaskExecutedTerraformVersion(assertions))    
            .andAssert((assertions) => new TaskExecutedTerraformCommand(assertions, "plan"))
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    });
    it('azurerm with var file', function(){
        let varFile = 'foo.vars';
        let terraformCommand = 'plan';
        let commandArgs = `-var-file=${varFile}`
        let expectedCommand = `${terraformCommand} ${commandArgs}`
        new TaskScenarioAssertion('./plan-azurerm-with-var-file')
            .thenAssert(new TaskExecutionSucceeded())
            .andAssert((assertions) => new TaskExecutedTerraformVersion(assertions))    
            .andAssert((assertions) => new TaskExecutedTerraformCommand(assertions, expectedCommand))
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    });
    it('azurerm with invalid auth scheme', function(){
        new TaskScenarioAssertion('./plan-azurerm-with-invalid-auth-scheme')
            .thenAssert(new TaskExecutionFailed('Terraform only supports service principal authorization for azure'))
            .andAssert((assertions) => new TaskExecutedTerraformVersion(assertions))
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
        new TaskScenarioAssertion('./apply-azurerm')
            .thenAssert(new TaskExecutionSucceeded())
            .andAssert((assertions) => new TaskExecutedTerraformVersion(assertions))    
            .andAssert((assertions) => new TaskExecutedTerraformCommand(assertions, expectedCommand))
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    });
    it('azurerm with var file', function(){
        let varFile = 'foo.vars';
        let terraformCommand = 'apply';
        let commandArgs = `-auto-approve -var-file=${varFile}`
        let expectedCommand = `${terraformCommand} ${commandArgs}`
        new TaskScenarioAssertion('./apply-azurerm-with-var-file')
            .thenAssert(new TaskExecutionSucceeded())
            .andAssert((assertions) => new TaskExecutedTerraformVersion(assertions))    
            .andAssert((assertions) => new TaskExecutedTerraformCommand(assertions, expectedCommand))
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    });
    it('azurerm with invalid auth scheme', function(){
        new TaskScenarioAssertion('./apply-azurerm-with-invalid-auth-scheme')
            .thenAssert(new TaskExecutionFailed('Terraform only supports service principal authorization for azure'))
            .andAssert((assertions) => new TaskExecutedTerraformVersion(assertions))
            // test runner does not expose env vars set within the task so cannot use this yet
            //.andAssert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, expectedEnv));
            .run();
    })
});