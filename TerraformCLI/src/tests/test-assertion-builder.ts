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