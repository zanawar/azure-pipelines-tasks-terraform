import { ICommand, CommandResponse, CommandStatus } from ".";
import { IRunner } from "../runners";
import { RunWithTerraform } from "../runners/builders";
import { ITaskContext } from "../context";

export class TerraformVersion implements ICommand {    
    private readonly runner: IRunner;

    constructor(runner: IRunner){
        this.runner = runner;
    }

    async exec(ctx: ITaskContext): Promise<CommandResponse> {
        const options = await new RunWithTerraform(ctx).build();
        const result = await this.runner.exec(options);
        return result.toCommandResponse();
    }
}