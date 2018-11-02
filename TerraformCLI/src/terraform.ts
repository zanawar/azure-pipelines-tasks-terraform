import { Container, injectable, inject } from 'inversify';
import { ToolRunner } from "azure-pipelines-task-lib/toolrunner";

export interface ICommand {
    name: string;
    workingDirectory: string;
}

export class TerraformCommand implements ICommand {
    public readonly name: string;
    public readonly workingDirectory: string;
    constructor(
        name: string, 
        workingDirectory: string) {        
        this.name = name;
        this.workingDirectory = workingDirectory;
    }
}

export interface IHandleCommand{
    execute(command: string): Promise<number>;
}

export interface IMediator{
    execute(command: string) : Promise<number>;
}

@injectable()
export class Mediator implements IMediator{
    private readonly container: Container;
    constructor(
        @inject("container") container: Container
    ) {
        this.container = container;
    }
    public async execute(command: string) : Promise<number> {
        let handler = this.container.getNamed<IHandleCommand>(TYPES.IHandleCommand, command);
        return await handler.execute(command);
    }

}

export interface ITerraformProvider{
    create() : ToolRunner
}

@injectable()
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

export const TYPES = {
    IMediator : Symbol("IMediator"),
    IHandleCommand : Symbol("IHandleCommand"),
    ITerraformProvider : Symbol("ITerraformProvider")
}
