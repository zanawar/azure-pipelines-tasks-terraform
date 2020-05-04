import { ICommand, CommandResponse } from ".";
import { IRunner } from "../runners";
import { AzureRMBackend, BackendTypes, ITerraformBackend } from "../backends";
import { RunWithTerraform } from "../runners/builders";
import { ITaskContext } from "../context";

export class TerraformInit implements ICommand {
    private readonly runner: IRunner;    

    constructor(runner: IRunner){
        this.runner = runner;
    }

    private getBackend(ctx: ITaskContext): ITerraformBackend | undefined{        
        let backend: ITerraformBackend | undefined;
        switch(ctx.backendType){
            case BackendTypes.azurerm:
                backend = new AzureRMBackend(this.runner);
                break;
        }
        return backend
    }

    async exec(ctx: ITaskContext): Promise<CommandResponse> {
        const backend = this.getBackend(ctx);
        const options = await new RunWithTerraform(ctx)
            .withBackend(ctx, backend)
            .build();

        const result = await this.runner.exec(options);
        return result.toCommandResponse();
    }
}
