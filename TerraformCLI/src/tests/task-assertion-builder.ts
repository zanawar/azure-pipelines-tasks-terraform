import assert = require("assert");
import { TaskAssertionBuilder, TaskContext, TaskAssertionDecorator } from "./task-scenario-builder";

export class TaskExecutionSucceeded extends TaskAssertionBuilder{
    run(context: TaskContext): void {
        assert.equal(context.testRunner.succeeded, true, 'should have succeeded');
        assert.equal(context.testRunner.errorIssues.length, 0, "should have no errors");
    }
}

export class TaskExecutionFailed extends TaskAssertionBuilder{
    run(context: TaskContext): void {
        assert.equal(context.testRunner.succeeded, false, 'should have succeeded');
        assert.notEqual(context.testRunner.errorIssues.length, 0, "should have no errors");
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

export class TaskExecutedTerraformVersion extends TaskExecutedCommand{
    constructor(builder: TaskAssertionBuilder) {
        super(builder, "terraform version");
    }
}
