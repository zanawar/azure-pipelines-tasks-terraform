import tasks = require("azure-pipelines-task-lib/task");
import { TerraformCommand, TerraformInterfaces, ITaskAgent, ILogger } from "./terraform";
import { IHandleCommandString } from "./command-handler";
import { injectable, inject } from "inversify";
import { TerraformRunner } from "./terraform-runner";

export class TerraformForceUnlock extends TerraformCommand{
    readonly secureVarsFile: string | undefined;
    readonly environmentServiceName: string | undefined;
    readonly lockID: string | undefined;

    constructor(
        name: string,
        workingDirectory: string,
        environmentServiceName: string | undefined,
        lockID: string,
        options?: string,
        secureVarsFile?: string) {
        super(name, workingDirectory, options);
        this.secureVarsFile = secureVarsFile;
        this.environmentServiceName = environmentServiceName;
        this.lockID = lockID;
    }
}

@injectable()
export class TerraformForceUnlockHandler implements IHandleCommandString{
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
        let forceUnlock = new TerraformForceUnlock(
            command,
            tasks.getInput("workingDirectory"),
            tasks.getInput("environmentServiceName"),
            tasks.getInput("commandOptions"),
            tasks.getInput("secureVarsFile"),
            tasks.getInput("lockID")
        );

        let loggedProps = {
            "secureVarsFileDefined": forceUnlock.secureVarsFile !== undefined && forceUnlock.secureVarsFile !== '' && forceUnlock.secureVarsFile !== null,
            "commandOptionsDefined": forceUnlock.options !== undefined && forceUnlock.options !== '' && forceUnlock.options !== null,
            "environmentServiceNameDefined": forceUnlock.environmentServiceName !== undefined && forceUnlock.environmentServiceName !== '' && forceUnlock.environmentServiceName !== null,
        }

        return this.log.command(forceUnlock, (command: TerraformForceUnlock) => this.onExecute(command), loggedProps);
    }

    private async onExecute(command: TerraformForceUnlock): Promise<number> {
        return new TerraformRunner(command)
            .withProvider(command.environmentServiceName)
            .withLockID(command.lockID)
            .withSecureVarsFile(this.taskAgent, command.secureVarsFile)
            .exec();
    }
}