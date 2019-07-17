import tasks = require("azure-pipelines-task-lib/task");
import { IExecOptions, ToolRunner } from "azure-pipelines-task-lib/toolrunner";
import { TerraformCommand, TerraformInterfaces, ITerraformProvider, ITaskAgent } from "./terraform";
import { IHandleCommandString } from "./command-handler";
import { injectable, inject } from "inversify";
import { Logger } from "./logger";

export class TerraformValidate extends TerraformCommand{
    readonly secureVarsFile: string | undefined;

    constructor(
        name: string, 
        workingDirectory: string,
        options?: string, 
        secureVarsFile?: string) {
        super(name, workingDirectory, options);
        this.secureVarsFile = secureVarsFile;
    }
}

@injectable()
export class TerraformValidateHandler implements IHandleCommandString{
    private readonly terraformProvider: ITerraformProvider;
    private readonly taskAgent: ITaskAgent;
    private readonly log: Logger;

    constructor(
        @inject(TerraformInterfaces.ITerraformProvider) terraformProvider: ITerraformProvider,
        @inject(TerraformInterfaces.ITaskAgent) taskAgent: ITaskAgent,
        @inject(Logger) log: Logger
    ) {
        this.terraformProvider = terraformProvider;   
        this.taskAgent = taskAgent; 
        this.log = log;
    }

    public async execute(command: string): Promise<number> {
        let validate = new TerraformValidate(
            command,
            tasks.getInput("workingDirectory"),
            tasks.getInput("commandOptions"),
            tasks.getInput("secureVarsFile")
        );
        
        return this.log.command(validate, (command: TerraformValidate) => this.onExecute(command));
    }

    private async onExecute(command: TerraformValidate): Promise<number> {
        var terraform = this.terraformProvider.create(command);
        await this.setupVars(command, terraform);
        return terraform.exec(<IExecOptions>{
            cwd: command.workingDirectory
        });
    }

    private async setupVars(command: TerraformValidate, terraform: ToolRunner){
        if(command.secureVarsFile){
            const secureFilePath = await this.taskAgent.downloadSecureFile(command.secureVarsFile);
            terraform.arg(`-var-file=${secureFilePath}`);
        }
    }
}