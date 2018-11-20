import tasks = require("azure-pipelines-task-lib/task");
import { IExecOptions, ToolRunner } from "azure-pipelines-task-lib/toolrunner";
import { IHandleCommand, TerraformCommand, TYPES, ITerraformProvider } from "./terraform";
import { injectable, inject } from "inversify";

export class TerraformValidate extends TerraformCommand{
    readonly varsFile: string | undefined;

    constructor(
        name: string, 
        workingDirectory: string,
        varsFile: string | undefined,
        options?: string) {
        super(name, workingDirectory, options);
        
        if(varsFile != workingDirectory){
            this.varsFile = varsFile;
        }            
    }
}

@injectable()
export class TerraformValidateHandler implements IHandleCommand{
    private readonly terraformProvider: ITerraformProvider;

    constructor(
        @inject(TYPES.ITerraformProvider) terraformProvider: ITerraformProvider
    ) {
        this.terraformProvider = terraformProvider;        
    }

    public async execute(command: string): Promise<number> {
        let init = new TerraformValidate(
            command,
            tasks.getInput("workingDirectory"),
            tasks.getInput("varsFile"),
            tasks.getInput("commandOptions")
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

    private setupVars(command: TerraformValidate, terraform: ToolRunner){
        if(command.varsFile){
            terraform.arg(`-var-file=${command.varsFile}`);
        }
    }
}