    import tasks = require("azure-pipelines-task-lib/task");
import { TerraformCommand, TerraformExecResult } from "./terraform";
import { ICommand, IHandleAsyncCommand } from "./command-handler";
import { injectable } from "inversify";
import { TerraformRunner } from "./terraform-runner";

export class TerraformVersionResult {
    public readonly exec: TerraformExecResult;
    constructor(exec: TerraformExecResult){
        this.exec = exec;
    }
}

export class TerraformVersion extends TerraformCommand implements ICommand<TerraformVersionResult>{
    constructor({ name, workingDirectory, options }: { name: string; workingDirectory: string; options?: string; }) {
        super(name, workingDirectory, options);
    }
}

@injectable()
export class TerraformVersionHandler implements IHandleAsyncCommand<TerraformVersion, TerraformVersionResult>{
    public async execute(command: TerraformVersion): Promise<TerraformVersionResult> {
        const result = await new TerraformRunner(
            new TerraformCommand("version", command.workingDirectory)
        )
        .execWithResult();
        return new TerraformVersionResult(result);
    }
}