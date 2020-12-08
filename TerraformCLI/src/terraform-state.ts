import tasks = require("azure-pipelines-task-lib/task");
import { TerraformCommand, TerraformInterfaces, ITaskAgent, ILogger } from "./terraform";
import { IHandleCommandString } from "./command-handler";
import { injectable, inject } from "inversify";
import { TerraformRunner } from "./terraform-runner";

export class TerraformState extends TerraformCommand{
    readonly secureVarsFile: string | undefined;
    readonly environmentServiceName: string | undefined;

    constructor(
        name: string,
        workingDirectory: string,
        environmentServiceName: string | undefined,
        secureVarsFile?: string,
        options?: string) {
        super(name, workingDirectory);
        this.secureVarsFile = secureVarsFile;
        this.environmentServiceName = environmentServiceName;
    }
}

@injectable()
export class TerraformStateHandler implements IHandleCommandString{
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
        let stateCommand = new TerraformState(
            command,
            tasks.getInput("workingDirectory"),
            tasks.getInput("environmentServiceName"),
            tasks.getInput("secureVarsFile"),
            tasks.getInput("commandOptions")
        );

        let loggedProps = {
            "secureVarsFileDefined": apply.secureVarsFile !== undefined && apply.secureVarsFile !== '' && apply.secureVarsFile !== null,
            "commandOptionsDefined": apply.options !== undefined && apply.options !== '' && apply.options !== null,
            "environmentServiceNameDefined": apply.environmentServiceName !== undefined && apply.environmentServiceName !== '' && apply.environmentServiceName !== null,
        }

        return this.log.command(stateCommand, (command: TerraformState) => this.onExecute(command), loggedProps);
    }

    private async onExecute(command: TerraformState): Promise<number> {
        return new TerraformRunner(command)
            .withProvider(command.environmentServiceName)
            .withSecureVarsFile(this.taskAgent, command.secureVarsFile)
            .exec();
    }
}
