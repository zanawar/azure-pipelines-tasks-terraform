import assert = require("assert");
import { MockTestRunner } from "azure-pipelines-task-lib/mock-test";

export interface TestContext{
    testRunner: MockTestRunner;
}

export abstract class TestAssertionBuilder{
    abstract run(context: TestContext): void;
}

export abstract class TestAssertionDecorator extends TestAssertionBuilder{
    protected readonly builder: TestAssertionBuilder;
    constructor(builder: TestAssertionBuilder) {
        super();
        this.builder = builder;
    }
}

export class DefaultTestAssertion extends TestAssertionBuilder{
    run(context: TestContext): void {
    }
}

export class TaskExecutionSucceeded extends TestAssertionDecorator{
    constructor(builder: TestAssertionBuilder) {
        super(builder);        
    }
    run(context: TestContext): void {        
        this.builder.run(context);
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

export class TestScenario{
    public readonly taskScenarioPath: string;
    private assertions: TestAssertionBuilder;    
    constructor(taskScenarioPath:string) {
        this.taskScenarioPath = taskScenarioPath;
        this.assertions = new DefaultTestAssertion();
    }
    public assert(assertion: (assertions: TestAssertionBuilder) => TestAssertionDecorator): TestScenario{
        this.assertions = assertion(this.assertions);
        return this;
    }
    public assertExecutionSucceeded() : TestScenario {
        this.assert((assertions) => new TaskExecutionSucceeded(assertions));
        return this;
    }
    public assertExecutionFailed(expectedError? : string) : TestScenario {
        this.assert((assertions) => new TaskExecutionFailed(assertions, expectedError));
        return this;
    }
    public assertExecutedCommand(command: string) : TestScenario {
        this.assert((assertions) => new TaskExecutedCommand(assertions, command));
        return this;
    }
    public assertEnvironmentVariables(env: { [key: string]: string }) : TestScenario {
        this.assert((assertions) => new TaskExecutedWithEnvironmentVariables(assertions, env));
        return this;
    }
    public run(): void{        
        if(!this.assertions)
            throw "no assertions defined for scenario";       

        var context = <TestContext>{
            testRunner : new MockTestRunner(this.taskScenarioPath)
        };
        context.testRunner.run();
        this.assertions.run(context);
    }
}

