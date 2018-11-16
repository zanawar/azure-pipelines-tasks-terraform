import { TestScenario, TaskExecutedCommand, TestAssertionBuilder } from "./test-scenario-runner";

declare module './test-scenario-runner'{
    interface TestScenario {        
        assertExecutedTerraformVersion(this: TestScenario) : TestScenario;
        assertExecutedTerraformCommand(this: TestScenario, terraformCommand: string) : TestScenario;
    }
}

export class TaskExecutedTerraformCommand extends TaskExecutedCommand{
    constructor(builder: TestAssertionBuilder, terraformCommand: string) {
        super(builder, `terraform ${terraformCommand}`);
    }
}
TestScenario.prototype.assertExecutedTerraformCommand = function(this: TestScenario, terraformCommand: string) : TestScenario {
    this.assert((assertions) => new TaskExecutedTerraformCommand(assertions, terraformCommand));
    return this;
}

export class TaskExecutedTerraformVersion extends TaskExecutedTerraformCommand{
    constructor(builder: TestAssertionBuilder) {
        super(builder, "version");
    }
}
TestScenario.prototype.assertExecutedTerraformVersion = function(this: TestScenario) : TestScenario {
    this.assert((assertions) => new TaskExecutedTerraformVersion(assertions));
    return this;
}