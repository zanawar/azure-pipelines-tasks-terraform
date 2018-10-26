import { ToolRunner } from "vsts-task-lib/toolrunner";

export class TerraformProvider implements ITerraformProvider{
    private readonly tasks: any;
    constructor(tasks: any) {
        this.tasks = tasks
    }

    public create(): ToolRunner {
        var terraformPath = this.tasks.which("terraform", true);
        return this.tasks.tool(terraformPath);
    }
}

export interface ITerraformProvider{
    create() : ToolRunner
}