import * as assert from 'assert';
import { MockTestRunner } from 'azure-pipelines-task-lib/mock-test';

describe('terraform', function(){
    it('should fail if terraform not exists', function(){
        let taskRunnerPath = require.resolve('./any-terraform-not-exists');
        let testRunner = new MockTestRunner(taskRunnerPath);    
        testRunner.run();
        assert.equal(testRunner.failed, true, 'should have failed');
        assert.notEqual(testRunner.errorIssues.length, 0, "should have errors");
    });
});