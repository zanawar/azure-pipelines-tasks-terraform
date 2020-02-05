import tasks = require("azure-pipelines-task-lib/task");
import { TerraformCommand, TerraformInterfaces, ITaskAgent, ILogger } from "./terraform";
import { IHandleCommandString } from "./command-handler";
import { injectable, inject } from "inversify";
import { TerraformRunner } from "./terraform-runner";

export class TerraformValidate extends TerraformCommand{
    readonly secureVarsFile: string | undefined;
    readonly isEnvFile: boolean | undefined;
    constructor(
        name: string, 
        workingDirectory: string,
        options?: string, 
        secureVarsFile?: string,
        isEnvFile?: boolean) {
        super(name, workingDirectory, options);
        this.secureVarsFile = secureVarsFile;
        this.isEnvFile = isEnvFile
    }
}

@injectable()
export class TerraformValidateHandler implements IHandleCommandString{
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
        let validate = new TerraformValidate(
            command,
            tasks.getInput("workingDirectory"),
            tasks.getInput("commandOptions"),
            tasks.getInput("secureVarsFile"),
            tasks.getBoolInput("isEnvFile", false)
        );

        let loggedProps = {
            "secureVarsFileDefined": validate.secureVarsFile !== undefined && validate.secureVarsFile !== '' && validate.secureVarsFile !== null,
            "commandOptionsDefined": validate.options !== undefined && validate.options !== '' && validate.options !== null
        }        
        
        return this.log.command(validate, (command: TerraformValidate) => this.onExecute(command), loggedProps);
    }

    private async onExecute(command: TerraformValidate): Promise<number> {
        return new TerraformRunner(command)
            .withSecureVarsFile(this.taskAgent, command.secureVarsFile, command.isEnvFile)
            .exec();
    }
}