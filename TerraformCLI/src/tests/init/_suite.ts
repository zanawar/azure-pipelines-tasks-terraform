import * as assert from 'assert';
import { MockTestRunner } from 'azure-pipelines-task-lib/mock-test';

describe('terraform cli', function(){
    it('any     :should fail if terraform not exists', function(){
        let taskRunnerPath = require.resolve('./any-terraform-not-exists');
        let testRunner = new MockTestRunner(taskRunnerPath);    
        testRunner.run();
        assert.equal(testRunner.failed, true, 'should have failed');
        assert.notEqual(testRunner.errorIssues.length, 0, "should have errors");
    });
    it('init    :should succeed', function(){
        let taskRunnerPath = require.resolve('./init-success');
        let testRunner = new MockTestRunner(taskRunnerPath);    
        testRunner.run();
        assert.equal(testRunner.succeeded, true, 'should have failed');
        assert.equal(testRunner.errorIssues.length, 0, "should have errors");
    });
});