import { terraformNotExists } from './terraform-not-exists';
import { initWithInvalidBackend } from './init-with-backend-invalid';
import { initWithBackendNull } from './init-with-backend-null'
import { initWithBackendAzureRm } from './init-with-backend-azurerm';
import { validateWithNoArgs } from './validate-with-no-args';
import { initWithBackendAzureRmWithInvalidAuth } from './init-with-backend-azurerm-with-invalid-auth'
import { planAzureRm } from './plan-azurerm';

describe('terraform', function(){
    it('terraform does not exist', function(){
        terraformNotExists.run();
    });
});

describe('terraform init', function(){
    it('no backend', function(){        
        initWithBackendNull.run();
    });
    it('invalid backend', function(){
        initWithInvalidBackend.run();
    }); 
    it('azurerm backend', function(){
        initWithBackendAzureRm.run();
    });       
    it('azurerm backend with invalid auth scheme', function(){
        initWithBackendAzureRmWithInvalidAuth.run();
    });
});

describe('terraform validate', function(){
    it('no args', function(){
        validateWithNoArgs.run();        
    });
    it('with var file');
});

describe('terraform plan', function(){
    it('azurerm', function(){    
        planAzureRm.run();    
    });
    it('azurerm with var file');
    it('azurerm with invalid auth scheme');
});