import tasks = require("azure-pipelines-task-lib/task");
import { TerraformCommand, TerraformInterfaces, ITaskAgent, ILogger } from "./terraform";
import { IHandleCommandString } from "./command-handler";
import { injectable, inject } from "inversify";
import { TerraformRunner, TerraformWithShow } from "./terraform-runner";
import * as file from "fs";
import { ResultDetails } from "azure-devops-node-api/interfaces/TestInterfaces";

export class TerraformShow extends TerraformCommand{
   readonly inputTargetPlanOrStateFilePath: string |undefined;
   readonly secureVarsFile: string | undefined;

    constructor(
        name: string,
        workingDirectory: string,
        inputTargetPlanOrStateFilePath: string,
        options?: string,
        secureVarsFile?: string){
        super(name, workingDirectory, options, true);

        this.inputTargetPlanOrStateFilePath = inputTargetPlanOrStateFilePath;
        this.secureVarsFile = secureVarsFile;
    }
}

@injectable()
export class TerraformShowHandler implements IHandleCommandString{
    private readonly log: ILogger;
    private readonly taskAgent: ITaskAgent;

    constructor(
        @inject(TerraformInterfaces.ITaskAgent) taskAgent: ITaskAgent,
        @inject(TerraformInterfaces.ILogger) log: ILogger
    ) {
        this.log = log;
        this.taskAgent = taskAgent;
    }

    public async execute(command: string): Promise<number> {
        let show = new TerraformShow(
            command,
            tasks.getInput("workingDirectory"),
            tasks.getInput("inputTargetPlanOrStateFilePath"),
            tasks.getInput("commandOptions"),
            tasks.getInput("secureVarsFile")
        );

        let loggedProps = {
            "commandOptionsDefined": show.options !== undefined && show.options !== '' && show.options !== null,
            "secureVarsFileDefined": show.secureVarsFile !== undefined && show.secureVarsFile !== '' && show.secureVarsFile !== null,
        }
        return this.log.command(show, (command: TerraformShow) => this.onExecute(command), loggedProps);
    }


    private async onExecute(command: TerraformShow): Promise<number> {
        let result = await new TerraformRunner(command)
            .withShowOptions(command.inputTargetPlanOrStateFilePath)
            .withSecureVarsFile(this.taskAgent, command.secureVarsFile)
            .execWithOutput();

        //check for destroy
        if (command.inputTargetPlanOrStateFilePath)
        {
            if(command.inputTargetPlanOrStateFilePath.includes(".tfstate"))
            {
                tasks.warning("Cannot check for destroy in .tfstate file");
            }
            else
            {
                this.detectDestroyChanges(result.stdout);
            }
        }

        return result.code;
    }

    private detectDestroyChanges(result: string): void
    {
        let jsonResult = JSON.parse(result);
        const deleteValue = "delete";

        for (let resourceChange  of jsonResult.resource_changes) {
            if  (resourceChange.change.actions.includes(deleteValue))
            {
                this.setDestroyDetectedFlag(true);
                tasks.warning("Destroy detected!")
                return;
            }
        }
        tasks.debug("No destroy detected")
        this.setDestroyDetectedFlag(false);
    }

    private setDestroyDetectedFlag(value : boolean):void
    {
        tasks.setVariable("TERRAFORM_PLAN_HAS_DESTROY_CHANGES", value.toString(), false);
        tasks.debug(`set vso[task.setvariable variable=TERRAFORM_PLAN_HAS_DESTROY_CHANGES] to ${value}`)
    }
}