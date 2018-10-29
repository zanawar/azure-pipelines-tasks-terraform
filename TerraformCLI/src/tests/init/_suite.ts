import * as assert from 'assert';
import { MockTestRunner } from 'azure-pipelines-task-lib/mock-test';

describe('sample task test', function(){
    
    before(() => {

    });

    after(() => {

    });

    it('should run', (done: MochaDone) => {
        var taskRunnerPath = require.resolve('./success');
        var testRunner = new MockTestRunner(taskRunnerPath);
        testRunner.run();
        console.log(testRunner.stdout);
        console.error(testRunner.stderr);   
        assert.equal(testRunner.succeeded, true, 'should have succeeded');
        assert.equal(testRunner.warningIssues.length, 0, "should have no warnings");
        assert.equal(testRunner.errorIssues.length, 0, "should have no errors");      

        done();
    })
})