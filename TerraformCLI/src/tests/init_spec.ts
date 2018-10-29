import * as assert from 'assert';
import { MockTestRunner } from 'azure-pipelines-task-lib/mock-test';

describe('terraform init', function(){
    it('should succeed', function(){
        let taskRunnerPath = require.resolve('./init-success');
        let testRunner = new MockTestRunner(taskRunnerPath);    
        testRunner.run();
        assert.equal(testRunner.succeeded, true, 'should have succeeded');
        assert.equal(testRunner.errorIssues.length, 0, "should have no errors");
    });
});