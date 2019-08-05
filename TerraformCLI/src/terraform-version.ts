import tasks = require("azure-pipelines-task-lib/task");
import { TerraformCommand } from "./terraform";
import { IHandleCommandString } from "./command-handler";
import { injectable } from "inversify";
import { TerraformRunner } from "./terraform-runner";

@injectable()
export class TerraformVersionHandler implements IHandleCommandString{
    public async execute(command: string): Promise<number> {
        return new TerraformRunner(
            new TerraformCommand("version", tasks.getInput("workingDirectory"))
        )
        .exec();
    }
}