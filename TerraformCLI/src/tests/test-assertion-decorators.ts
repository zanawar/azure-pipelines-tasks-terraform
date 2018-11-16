import assert = require("assert");
import { TestAssertionDecorator, TestAssertionBuilder, TestContext } from "./test-assertion-builder";
import { TestScenario } from "./test-scenario-runner";

export class TaskExecutionSucceeded extends TestAssertionDecorator{
    constructor(builder: TestAssertionBuilder) {
        super(builder);        
    }
    run(context: TestContext): void {
        assert.equal(context.testRunner.succeeded, true, 'should have succeeded');
        assert.equal(context.testRunner.errorIssues.length, 0, "should have no errors");
    }
}

export class TaskExecutionFailed extends TestAssertionDecorator{
    private readonly expectedError: string | undefined;
    constructor(builder: TestAssertionBuilder, expectedError? : string) {
        super(builder);
        this.expectedError = expectedError;
    }
    run(context: TestContext): void {
        assert.equal(context.testRunner.succeeded, false, 'should have succeeded');
        assert.notEqual(context.testRunner.errorIssues.length, 0, "should have no errors");
        if(this.expectedError){
            assert.notEqual(context.testRunner.errorIssues.indexOf(this.expectedError), -1, `Expected error not found '${this.expectedError}'`);
        }
    }
}

export class TaskExecutedCommand extends TestAssertionDecorator{
    private readonly command: string;
    constructor(builder: TestAssertionBuilder, command: string) {
        super(builder);
        this.command = command;
    }
    run(context: TestContext): void {
        this.builder.run(context);
        assert.equal(context.testRunner.cmdlines[this.command], true, `should have run command '${this.command}'`);
    }
}

export class TaskExecutedTerraformCommand extends TaskExecutedCommand{
    constructor(builder: TestAssertionBuilder, terraformCommand: string) {
        super(builder, `terraform ${terraformCommand}`);
    }
}

export class TaskExecutedTerraformVersion extends TaskExecutedTerraformCommand{
    constructor(builder: TestAssertionBuilder) {
        super(builder, "version");
    }
}

export class TaskExecutedWithEnvironmentVariables extends TestAssertionDecorator {
    private readonly env: { [key: string]: string; };
    constructor(assertions: TestAssertionBuilder, env: { [key: string]: string }) {
        super(assertions);
        this.env = env;
    }
    run(context: TestContext): void {        
        this.builder.run(context);
        for(var v in this.env){
            assert.equal(process.env[v], this.env[v], `Expected env var '${v}' to be '${this.env[v]}'. Actual was '${process.env[v]}'`);
        }        
    }
}

declare module './test-scenario-runner'{
    interface TestScenario {        
        assertExecutionSucceeded(this: TestScenario) : TestScenario;
        assertExecutionFailed(this: TestScenario, expectedError? : string) : TestScenario;
        assertExecutedCommand(this: TestScenario, command: string) : TestScenario;
        assertEnvironmentVariables(this: TestScenario, env: { [key: string]: string }) : TestScenario;
    }
}

TestScenario.prototype.assertExecutionSucceeded = function(this: TestScenario) : TestScenario {
    this.assert((assertions) => new TaskExecutionSucceeded(assertions));
    return this;
}
TestScenario.prototype.assertExecutionFailed = function(this: TestScenario, expectedError? : string) : TestScenario {
    this.assert((assertions) => new TaskExecutionFailed(assertions, expectedError));
    return this;
}
TestScenario.prototype.assertExecutedCommand = function(this: TestScenario, command: string) : TestScenario {
    this.assert((assertions) => new TaskExecutedCommand(assertions, command));
    return this;
}
TestScenario.prototype.assertEnvironmentVariables = function(this: TestScenario, env: { [key: string]: string }) : TestScenario {
    this.assert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, env));
    return this;
}