import tasks = require("azure-pipelines-task-lib/task");
import { TerraformCommand, TerraformInterfaces, ITaskAgent, ILogger } from "./terraform";
import { injectable, inject } from "inversify";
import { IHandleCommandString } from "./command-handler";
import { TerraformRunner } from "./terraform-runner";

export class TerraformRefresh extends TerraformCommand {
    readonly secureVarsFile: string | undefined;
    readonly environmentServiceName: string;

    constructor(
        name: string, 
        workingDirectory: string,
        environmentServiceName: string, 
        secureVarsFile: string | undefined,
        options?: string) {
        super(name, workingDirectory, options);
        this.environmentServiceName = environmentServiceName;
        this.secureVarsFile = secureVarsFile;
    }
}

@injectable()
export class TerraformRefreshHandler implements IHandleCommandString{
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
        let refresh = new TerraformRefresh(
            command,
            tasks.getInput("workingDirectory"),
            tasks.getInput("environmentServiceName", true),
            tasks.getInput("secureVarsFile"),
            tasks.getInput("commandOptions")
        );

        let loggedProps = {
            "secureVarsFileDefined": refresh.secureVarsFile !== undefined && refresh.secureVarsFile !== '' && refresh.secureVarsFile !== null,
            "commandOptionsDefined": refresh.options !== undefined && refresh.options !== '' && refresh.options !== null
        }
        
        return this.log.command(refresh, (command: TerraformRefresh) => this.onExecute(command), loggedProps);
    }

    private async onExecute(command: TerraformRefresh): Promise<number> {
        return await new TerraformRunner(command)
            .withSecureVarsFile(this.taskAgent, command.secureVarsFile)
            .withAzureRmProvider(command.environmentServiceName)
            .exec();
    }
}