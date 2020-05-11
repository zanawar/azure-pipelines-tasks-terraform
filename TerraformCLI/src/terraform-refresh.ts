import tasks = require("azure-pipelines-task-lib/task");
import { TerraformCommand, TerraformInterfaces, ITaskAgent, ILogger } from "./terraform";
import { IHandleCommandString } from "./command-handler";
import { injectable, inject } from "inversify";
import { TerraformRunner } from "./terraform-runner";

export class TerraformRefresh extends TerraformCommand{
    readonly secureVarsFile: string | undefined;
    readonly environmentServiceName: string;

    constructor(
        name: string, 
        workingDirectory: string,
        environmentServiceName: string,
        options?: string, 
        secureVarsFile?: string) {
        super(name, workingDirectory, options);
        this.secureVarsFile = secureVarsFile;
        this.environmentServiceName = environmentServiceName;
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
            tasks.getInput("commandOptions"),
            tasks.getInput("secureVarsFile")
        );

        let loggedProps = {
            "secureVarsFileDefined": refresh.secureVarsFile !== undefined && refresh.secureVarsFile !== '' && refresh.secureVarsFile !== null,
            "commandOptionsDefined": refresh.options !== undefined && refresh.options !== '' && refresh.options !== null
        }        
        
        return this.log.command(refresh, (command: TerraformRefresh) => this.onExecute(command), loggedProps);
    }

    private async onExecute(command: TerraformRefresh): Promise<number> {
        return new TerraformRunner(command)
            .withAzureRmProvider(command.environmentServiceName)
            .withSecureVarsFile(this.taskAgent, command.secureVarsFile)
            .exec();
    }
}