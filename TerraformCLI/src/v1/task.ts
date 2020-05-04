import { ITaskAgent } from "../terraform";
import { IRunner } from "./runners";
import * as commands from "./commands";
import { ITaskContext } from "./context";

export class Task {
    private readonly runner: IRunner;
    private readonly taskAgent: ITaskAgent;
    private readonly ctx: ITaskContext;
    
    constructor(ctx: ITaskContext, runner: IRunner, taskAgent: ITaskAgent){        
        this.ctx = ctx;
        this.runner = runner;
        this.taskAgent = taskAgent;
    }     

    async exec(): Promise<commands.CommandResponse> {
        const command = <commands.ICommand>(<any>this)[this.ctx.name]();

        if(!command){
            throw new Error(`Support for command "${this.ctx.name}" is not implemented`);
        }

        let response: commands.CommandResponse | undefined;

        try{
            response = await command.exec(this.ctx);
        }
        catch(err){
            const error = err as Error;
            response = new commands.CommandResponse(commands.CommandStatus.Failed, error.message);
        }
        finally{
            if(response && response.lastExitCode !== undefined){
                this.ctx.setVariable("TERRAFORM_LAST_EXITCODE", response.lastExitCode.toString());
            }
        }
        return response;
    }

    version(): commands.ICommand {
        return new commands.VersionCommandHandler(this.runner);
    }

    init(): commands.ICommand {
        return new commands.InitCommandHandler(this.runner);
    }

    validate(): commands.ICommand {
        return new commands.ValidateCommandHandler(this.taskAgent, this.runner);
    }

    plan(): commands.ICommand {
        throw "Not Implemented";
    }

    apply(): commands.ICommand {
        throw "Not Implemented";
    }

    destroy(): commands.ICommand {
        throw "Not Implemented";
    }  
}