import tasks = require("azure-pipelines-task-lib/task");
import { TerraformCommand, TerraformInterfaces, ITaskAgent, ILogger } from "./terraform";
import { IHandleCommandString } from "./command-handler";
import { injectable, inject } from "inversify";
import { TerraformRunner, TerraformWithShow } from "./terraform-runner";
import * as file from "fs";

export class TerraformShow extends TerraformCommand{
   readonly outputFile: string | undefined;
   readonly inputPlanFile: string |undefined;
   readonly detectDestroy: boolean |undefined;

    constructor(
        name: string, 
        workingDirectory: string,
        inputPlanFile: string,
        outputFile: string,    
        detectDestroy: boolean,
        options?: string){
        super(name, workingDirectory, options);
        this.inputPlanFile = inputPlanFile;
        this.outputFile = outputFile;
        this.detectDestroy = detectDestroy;
    }
}

@injectable()
export class TerraformShowHandler implements IHandleCommandString{
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
        let show = new TerraformShow(
            command,
            tasks.getInput("workingDirectory"),   
            tasks.getInput("inputPlanFile"),
            tasks.getInput("outputFile"),
            tasks.getBoolInput("detectDestroy"),
            tasks.getInput("commandOptions")
        );

        let loggedProps = {
            "commandOptionsDefined": show.options !== undefined && show.options !== '' && show.options !== null,
            "inputPlanFile": show.inputPlanFile !== undefined && show.inputPlanFile !== '' && show.inputPlanFile !== null,
            "outputFile": show.outputFile !== undefined && show.outputFile !=='' && show.outputFile != null
        }             
        return this.log.command(show, (command: TerraformShow) => this.onExecute(command), loggedProps);       
    }

    
    private async onExecute(command: TerraformShow): Promise<number> {
        let result = await new TerraformRunner(command)
            .withShowOptions(command.inputPlanFile)
            .execWithOutput();
              
        //Save to file  
        if (command.outputFile !== undefined)
        {
            this.saveToFile(result.stdout, command.outputFile);
        }

        //check for destroy
        if(command.detectDestroy === true)
        {  
            if (command.inputPlanFile !== undefined)
            {
                if(command.inputPlanFile.includes(".tfstate"))
                {     
                    console.warn("Cannot check for destroy in .tfstate file");
                }  
                else 
                {
                    this.detectDestroyChanges(result.stdout);   
                } 
            }       
        }
        return result.code;
    }

    private saveToFile(content: string, outputFile: string):void
    {
        file.writeFile(outputFile, content,  function(err) {
            if (err) {
                console.error(`failed to save output to a file ${err}`);
            }
            console.log(`Json output saved to ${outputFile}`);
        });          
    }

    private detectDestroyChanges(result: string): void
    {
        let jsonResult = JSON.parse(result);
        const deleteValue = "delete";

        for (let resourceChange  of jsonResult.resource_changes) {
            if  (resourceChange.change.actions.includes(deleteValue))
            {
                this.setDestroyDetectedFlag("TRUE");
                console.warn("Destroy detected!")
                return;
            }
        }
        this.setDestroyDetectedFlag("FALSE");  
    }

    private setDestroyDetectedFlag(value : string):void
    {
        tasks.setVariable("TERRAFORM_PLAN_HAS_DESTROY_CHANGES", value, false);
        console.log(`set vso[task.setvariable variable=TERRAFORM_PLAN_HAS_DESTROY_CHANGES] to ${value}`)
    }
}