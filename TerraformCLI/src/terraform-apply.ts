import tasks = require("azure-pipelines-task-lib/task");
import { TerraformCommand, TerraformInterfaces, ITaskAgent, ILogger } from "./terraform";
import { injectable, inject } from "inversify";
import { IHandleCommandString } from "./command-handler";
import { TerraformRunner } from "./terraform-runner";

export class TerraformApply extends TerraformCommand {
    readonly secureVarsFile: string | undefined;
    readonly isEnvfile: boolean;
    readonly environmentServiceName: string;

    constructor(
        name: string, 
        workingDirectory: string,
        environmentServiceName: string, 
        secureVarsFile: string | undefined,
        isEnvFile: boolean,
        options?: string) {
        super(name, workingDirectory, options);
        this.environmentServiceName = environmentServiceName;
        this.secureVarsFile = secureVarsFile;
        this.isEnvfile = isEnvFile;
    }
}

@injectable()
export class TerraformApplyHandler implements IHandleCommandString{
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
        let apply = new TerraformApply(
            command,
            tasks.getInput("workingDirectory"),
            tasks.getInput("environmentServiceName", true),
            tasks.getInput("secureVarsFile"),
            tasks.getBoolInput("isEnvFile", false),
            tasks.getInput("commandOptions")
        );

        let loggedProps = {
            "secureVarsFileDefined": apply.secureVarsFile !== undefined && apply.secureVarsFile !== '' && apply.secureVarsFile !== null,
            "commandOptionsDefined": apply.options !== undefined && apply.options !== '' && apply.options !== null
        }
        
        return this.log.command(apply, (command: TerraformApply) => this.onExecute(command), loggedProps);
    }

    private async onExecute(command: TerraformApply): Promise<number> {
        return await new TerraformRunner(command)
            .withSecureVarsFile(this.taskAgent, command.secureVarsFile, command.isEnvfile)
            .withAutoApprove()
            .withAzureRmProvider(command.environmentServiceName)
            .exec();
    }
}