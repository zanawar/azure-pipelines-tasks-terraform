import * as assert from 'assert';
import { MockTestRunner } from 'azure-pipelines-task-lib/mock-test';

describe('terraform validate', function(){
    it('should execute without -var-file defined', function(){
        let taskRunnerPath = require.resolve('./validate-success');
        let testRunner = new MockTestRunner(taskRunnerPath);    
        testRunner.run();
        assert.equal(testRunner.succeeded, true, 'should have succeeded');
        assert.equal(testRunner.errorIssues.length, 0, "should have no errors");
    });
});