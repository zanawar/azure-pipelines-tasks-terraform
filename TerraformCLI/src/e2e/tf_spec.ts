import * as assert from 'assert';
import { MockTestRunner } from 'azure-pipelines-task-lib/mock-test';

// describe('terraform e2e', function(){
//     it('should succeed', function(){
//         let tfInitPath = require.resolve('./tf-init');
//         let tfInit = new MockTestRunner(tfInitPath);    
//         tfInit.run();
//         console.log(tfInit.stdout);
//         console.error(tfInit.stderr);
//         assert.equal(tfInit.succeeded, true, 'init should have succeeded');
//         assert.equal(tfInit.errorIssues.length, 0, 'init should have no errors');

//         let tfValidatePath = require.resolve('./tf-validate');
//         let tfValidate = new MockTestRunner(tfValidatePath);    
//         tfValidate.run();        
//         console.log(tfValidate.stdout);
//         console.error(tfValidate.stderr);
//         assert.equal(tfValidate.succeeded, true, 'validate should have succeeded');
//         assert.equal(tfValidate.errorIssues.length, 0, 'validate should have no errors');        
//     });
// });