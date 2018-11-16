import assert = require("assert");
import { TaskAssertionBuilder, TaskContext, TaskAssertionDecorator } from "./task-scenario-builder";

export class TaskExecutionSucceeded extends TaskAssertionBuilder{
    run(context: TaskContext): void {
        assert.equal(context.testRunner.succeeded, true, 'should have succeeded');
        assert.equal(context.testRunner.errorIssues.length, 0, "should have no errors");
    }
}

export class TaskExecutionFailed extends TaskAssertionBuilder{
    private readonly expectedError: string | undefined;
    constructor(expectedError? : string) {
        super();
        this.expectedError = expectedError;
    }
    run(context: TaskContext): void {
        assert.equal(context.testRunner.succeeded, false, 'should have succeeded');
        assert.notEqual(context.testRunner.errorIssues.length, 0, "should have no errors");
        if(this.expectedError){
            assert.notEqual(context.testRunner.errorIssues.indexOf(this.expectedError), -1, `Expected error not found '${this.expectedError}'`);
        }
    }
}

export class TaskExecutedCommand extends TaskAssertionDecorator{
    private readonly command: string;
    constructor(builder: TaskAssertionBuilder, command: string) {
        super(builder);
        this.command = command;
    }
    run(context: TaskContext): void {
        this.builder.run(context);
        assert.equal(context.testRunner.cmdlines[this.command], true, `should have run command '${this.command}'`);
    }
}

export class TaskExecutedTerraformCommand extends TaskExecutedCommand{
    constructor(builder: TaskAssertionBuilder, terraformCommand: string) {
        super(builder, `terraform ${terraformCommand}`);
    }
}

export class TaskExecutedTerraformVersion extends TaskExecutedTerraformCommand{
    constructor(builder: TaskAssertionBuilder) {
        super(builder, "version");
    }
}

export class TaskExecutedWithEnvironmentVariables extends TaskAssertionDecorator {
    private readonly env: { [key: string]: string; };
    constructor(assertions: TaskAssertionBuilder, env: { [key: string]: string }) {
        super(assertions);
        this.env = env;
    }
    run(context: TaskContext): void {        
        this.builder.run(context);
        for(var v in this.env){
            assert.equal(process.env[v], this.env[v], `Expected env var '${v}' to be '${this.env[v]}'. Actual was '${process.env[v]}'`);
        }        
    }
}
