import { injectable } from 'inversify';
import { ToolRunner } from "azure-pipelines-task-lib/toolrunner";
import { PullRequestSystemType } from 'azure-devops-node-api/interfaces/ReleaseInterfaces';

export class TerraformCommand {
    public readonly name: string;
    public readonly options: string | undefined;
    public readonly workingDirectory: string;
    constructor(
        name: string,
        workingDirectory: string,
        options?: string) {
        this.name = name;
        this.workingDirectory = workingDirectory;
        this.options = options;
    }
}

export interface ITerraformProvider {
    create(command?: TerraformCommand): ToolRunner
}

@injectable()
export class TerraformProvider implements ITerraformProvider {
    private readonly tasks: any;
    constructor(tasks: any) {
        this.tasks = tasks
    }

    public create(command?: TerraformCommand): ToolRunner {
        let terraformPath = this.tasks.which("terraform", true);
        let terraform: ToolRunner = this.tasks.tool(terraformPath);
        if (command) {
            terraform.arg(command.name);
            if (command.options) {
                terraform.line(command.options);
            }
        }

        return terraform;
    }
}

export interface ITaskAgent {
    downloadSecureFile(secureFileId: string): Promise<string>
}

export interface ILogger {
    command<TCommand extends TerraformCommand>(command: TCommand, handler: (command: TCommand) => Promise<number>, properties: any) : Promise<number>;
    debug(message: string): void;
    error(message: string): void;
}

export const TerraformInterfaces = {
    ITerraformProvider: Symbol("ITerraformProvider"),
    ITaskAgent: Symbol('ITaskAgent'),
    ILogger: Symbol('ILogger')
}
