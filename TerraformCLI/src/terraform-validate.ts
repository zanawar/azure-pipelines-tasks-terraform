import tasks = require("azure-pipelines-task-lib/task");
import { IExecOptions, ToolRunner } from "azure-pipelines-task-lib/toolrunner";
import { IHandleCommand, TerraformCommand, TYPES, ITerraformProvider, ITaskAgent } from "./terraform";
import { injectable, inject } from "inversify";

export class TerraformValidate extends TerraformCommand{
    readonly varsFile: string | undefined;
    readonly secureVarsFile: string | undefined;

    constructor(
        name: string, 
        workingDirectory: string,
        varsFile: string | undefined,
        options?: string, 
        secureVarsFile?: string) {
        super(name, workingDirectory, options);
        
        if(varsFile != workingDirectory){
            this.varsFile = varsFile;
        }            
        this.secureVarsFile = secureVarsFile;
    }
}

@injectable()
export class TerraformValidateHandler implements IHandleCommand{
    private readonly terraformProvider: ITerraformProvider;
    private readonly taskAgent: ITaskAgent;

    constructor(
        @inject(TYPES.ITerraformProvider) terraformProvider: ITerraformProvider,
        @inject(TYPES.ITaskAgent) taskAgent: ITaskAgent,
    ) {
        this.terraformProvider = terraformProvider;   
        this.taskAgent = taskAgent;
    }

    public async execute(command: string): Promise<number> {
        let init = new TerraformValidate(
            command,
            tasks.getInput("workingDirectory"),
            tasks.getInput("varsFile"),
            tasks.getInput("commandOptions"),
            tasks.getInput("secureVarsFile")
        );
        return this.onExecute(init);
    }

    private async onExecute(command: TerraformValidate): Promise<number> {
        var terraform = this.terraformProvider.create(command);
        this.setupVars(command, terraform);
        return terraform.exec(<IExecOptions>{
            cwd: command.workingDirectory
        });
    }

    private async setupVars(command: TerraformValidate, terraform: ToolRunner){
        if(command.varsFile){
            terraform.arg(`-var-file=${command.varsFile}`);
        }
        if(command.secureVarsFile){
            const secureFilePath = await this.taskAgent.downloadSecureFile(command.secureVarsFile);
            terraform.arg(`-var-file=${secureFilePath}`);
        }
    }
}