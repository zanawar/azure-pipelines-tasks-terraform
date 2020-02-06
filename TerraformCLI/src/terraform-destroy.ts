import tasks = require("azure-pipelines-task-lib/task");
import { TerraformCommand, ITaskAgent, TerraformInterfaces, ILogger } from "./terraform";
import { injectable, inject } from "inversify";
import { IHandleCommandString } from "./command-handler";
import { TerraformRunner } from "./terraform-runner";

export class TerraformDestroy extends TerraformCommand{
    readonly secureVarsFile: string | undefined;
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
    }
}

@injectable()
export class TerraformDestroyHandler implements IHandleCommandString{
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
        let destroy = new TerraformDestroy(
            command,
            tasks.getInput("workingDirectory"),
            tasks.getInput("environmentServiceName", true),
            tasks.getInput("secureVarsFile"),
            tasks.getBoolInput("isEnvFile", false),
            tasks.getInput("commandOptions")
        );

        let loggedProps = {
            "secureVarsFileDefined": destroy.secureVarsFile !== undefined && destroy.secureVarsFile !== '' && destroy.secureVarsFile !== null,
            "commandOptionsDefined": destroy.options !== undefined && destroy.options !== '' && destroy.options !== null
        }
        
        return this.log.command(destroy, (command: TerraformDestroy) => this.onExecute(command), loggedProps);
    }

    private async onExecute(command: TerraformDestroy): Promise<number> {
        return await new TerraformRunner(command)                                    
            .withAutoApprove()
            .withAzureRmProvider(command.environmentServiceName)            
            .withSecureVarsFile(this.taskAgent, command.secureVarsFile)
            .exec();
    }
}