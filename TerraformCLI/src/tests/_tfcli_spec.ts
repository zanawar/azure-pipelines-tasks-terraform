import { terraformNotExists } from './terraform-not-exists';
import { initWithInvalidBackend } from './init-with-backend-invalid';
import { initWithBackendNull } from './init-with-backend-null'
import { initWithBackendAzureRm } from './init-with-backend-azurerm';
import { validateWithNoArgs } from './validate-with-no-args';
import { initWithBackendAzureRmWithInvalidAuth } from './init-with-backend-azurerm-with-invalid-auth'

describe('terraform', function(){
    it('terraform does not exist', function(){
        terraformNotExists.run();
    });
});

describe('terraform init', function(){
    it('no backend', function(){        
        initWithBackendNull.run();
    });
    it('with invalid backend', function(){
        initWithInvalidBackend.run();
    }); 
    it('with azurerm backend', function(){
        initWithBackendAzureRm.run();
    });       
    it('with azurerm backend with invalid auth scheme', function(){
        initWithBackendAzureRmWithInvalidAuth.run();
    });
});

describe('terraform validate', function(){
    it('with no args', function(){
        validateWithNoArgs.run();
        
    });
});
