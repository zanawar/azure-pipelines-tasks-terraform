import tasks = require("azure-pipelines-task-lib/task");
import { TerraformCommand, TerraformInterfaces, ILogger } from "./terraform";
import { IHandleCommandString } from "./command-handler";
import { injectable, inject } from "inversify";
import { TerraformRunner } from "./terraform-runner";

export class TerraformOutput extends TerraformCommand{
   readonly inputTargetPlanOrStateFilePath: string |undefined;

    constructor(
        name: string, 
        workingDirectory: string,
        options?: string){
        super(name, workingDirectory, options, true);
    }
}

@injectable()
export class TerraformOutputHandler implements IHandleCommandString{
    private readonly log: ILogger;

    constructor(
        @inject(TerraformInterfaces.ILogger) log: ILogger
    ) {
        this.log = log;
    }

    public async execute(command: string): Promise<number> {
        const output = new TerraformOutput(
            command,
            tasks.getInput("workingDirectory"),   
            tasks.getInput("commandOptions")
        );
        
        const loggedProps = {
            "commandOptionsDefined": output.options !== undefined && output.options !== '' && output.options !== null,
        }   
        return this.log.command(output, (command: TerraformOutput) => this.onExecute(command), loggedProps);       
    }

    
    private async onExecute(command: TerraformOutput): Promise<number> {
        const result = await new TerraformRunner(command)
            .withJsonOutput()
            .withOptions()
            .execWithOutput();
        
        if(result.stdout){
            const outputVariables = JSON.parse(result.stdout);

            for(const key in outputVariables){
                const outputVariable = outputVariables[key];
                if(["string", "number", "bool"].includes(outputVariable.type)){
                    // set pipeline variable so its available to subsequent steps
                    tasks.setVariable(`TF_OUT_${key.toUpperCase()}`, outputVariable.value, outputVariable.sensitive);
                }
            }   
        }
        else{
            tasks.warning("Terraform output command was run but, returned no results. No output variables found.")
        }             
        
        return result.code;
    }
}