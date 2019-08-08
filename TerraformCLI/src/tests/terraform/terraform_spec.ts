import { TestScenario } from '../assertions';
import '../assertions-terraform';

describe('terraform', function(){    
    it('terraform does not exist', function(){
        new TestScenario(require.resolve('./terraform-not-exists'))
            .assertExecutionFailed()
            .run();
    });
    it('terraform populates stderr on success', function(){
        new TestScenario(require.resolve('./terraform-populates-stderr-on-success'))
            .assertExecutionSucceeded()
            .run();
    });
});