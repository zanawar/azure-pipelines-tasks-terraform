import tasks = require("azure-pipelines-task-lib/task");
import { inject, injectable } from "inversify";
import { IHandleCommandString } from "./command-handler";
import { ILogger, ITaskAgent, TerraformCommand, TerraformInterfaces } from "./terraform";
import { TerraformRunner } from "./terraform-runner";

export class TerraformFmt extends TerraformCommand{
    readonly secureVarsFile: string | undefined;
    constructor(
        name: string, 
        workingDirectory: string,
        options?: string) {

        super(name, workingDirectory, options, false);
    }
}

@injectable()
export class TerraformFmtHandler implements IHandleCommandString{
    private readonly taskAgent: ITaskAgent;
    private readonly log: ILogger;

    constructor(
        @inject(TerraformInterfaces.ITaskAgent) taskAgent: ITaskAgent,
        @inject(TerraformInterfaces.ILogger) log: ILogger
    ) {
        this.taskAgent = taskAgent; 
        this.log = log;
    }

    public async execute(command: string): Promise<number> {
        let fmt = new TerraformFmt(
            command,
            tasks.getInput("workingDirectory") || "./", 
            tasks.getInput("commandOptions") || "--check --diff",
        );

        let loggedProps = {
            "commandOptionsDefined": fmt.options !== undefined && fmt.options !== '' && fmt.options !== null
        }        
        
        return this.log.command(fmt, (command: TerraformFmt) => this.onExecute(command), loggedProps);
    }

    private async onExecute(command: TerraformFmt): Promise<number> {
        return new TerraformRunner(command)
            .exec();
    }
}