import { MockTestRunner } from "azure-pipelines-task-lib/mock-test";
import { TestAssertionBuilder, DefaultTestAssertion, TestAssertionDecorator, TestContext } from "./test-assertion-builder";

export class TestScenario{
    public readonly testPath: string;
    private assertions: TestAssertionBuilder;    
    constructor(testPath:string) {
        this.testPath = require.resolve(testPath);
        this.assertions = new DefaultTestAssertion();
    }

    public assert(assertion: (assertions: TestAssertionBuilder) => TestAssertionDecorator): TestScenario{
        this.assertions = assertion(this.assertions);
        return this;
    }

    public run(): void{        
        if(!this.assertions)
            throw "no assertions defined for scenario";       

        var context = <TestContext>{
            testRunner : new MockTestRunner(this.testPath)
        };
        context.testRunner.run();
        this.assertions.run(context);
    }
}
