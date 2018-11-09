import { terraformNotExists } from './terraform-not-exists';
import { initWithInvalidBackend } from './init-with-backend-invalid';
import { initWithBackendNull } from './init-with-backend-null'
import { initWithBackendAzureRm } from './init-with-backend-azurerm';
import { validateWithNoArgs } from './validate-with-no-args';

describe('terraform', function(){
    it('terraform does not exist', function(){
        terraformNotExists.run();
    });
});

describe('terraform init', function(){
    it('executes init successfully no backend', function(){        
        initWithBackendNull.run();
    });
    it('executes init successfully with invalid backend', function(){
        initWithInvalidBackend.run();
    }); 
    it('executes init successfully with azurerm backend', function(){
        initWithBackendAzureRm.run();
    });       
});

describe('terraform validate', function(){
    it('with no args', function(){
        validateWithNoArgs.run();
        
    });
});
