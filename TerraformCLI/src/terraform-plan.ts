import tasks = require("azure-pipelines-task-lib/task");
import { TerraformCommand, TerraformInterfaces, ITaskAgent, ILogger } from "./terraform";
import { IHandleCommandString } from "./command-handler";
import { injectable, inject } from "inversify";
import { TerraformRunner } from "./terraform-runner";

export class TerraformPlan extends TerraformCommand{
    readonly secureVarsFile: string | undefined;
    readonly environmentServiceName: string | undefined;

    constructor(
        name: string,
        workingDirectory: string,
        environmentServiceName: string | undefined,
        options?: string,
        secureVarsFile?: string) {
        super(name, workingDirectory, options);
        this.environmentServiceName = environmentServiceName;
        this.secureVarsFile = secureVarsFile;
    }
}

@injectable()
export class TerraformPlanHandler implements IHandleCommandString{
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
        let plan = new TerraformPlan(
            command,
            tasks.getInput("workingDirectory"),
            tasks.getInput("environmentServiceName"),
            tasks.getInput("commandOptions"),
            tasks.getInput("secureVarsFile")
        );

        let loggedProps = {
            "secureVarsFileDefined": plan.secureVarsFile !== undefined && plan.secureVarsFile !== '' && plan.secureVarsFile !== null,
            "commandOptionsDefined": plan.options !== undefined && plan.options !== '' && plan.options !== null,
            "environmentServiceNameDefined": plan.environmentServiceName !== undefined && plan.environmentServiceName !== '' && plan.environmentServiceName !== null,
        }

        return this.log.command(plan, (command: TerraformPlan) => this.onExecute(command), loggedProps);
    }

    private async onExecute(command: TerraformPlan): Promise<number> {
        let exitCode = await new TerraformRunner(command)
            .withProvider(command.environmentServiceName)
            .withSecureVarsFile(this.taskAgent, command.secureVarsFile)
            .exec(this.getPlanSuccessfulExitCodes(command.options));

        this.setPlanHasChangesVariable(command.options, exitCode);

        return exitCode;
    }

    private getPlanSuccessfulExitCodes(commandOptions: string | undefined): number[]{
        let rvalues: number[] = [];
        rvalues.push(0);
        if(this.hasDetailedExitCode(commandOptions))
            rvalues.push(2);
        return rvalues;
    }

    private hasDetailedExitCode(commandOptions: string | undefined): boolean{
        return commandOptions !== undefined && commandOptions !== null && commandOptions.indexOf('-detailed-exitcode') > -1;
    }

    private getPlanHasChangesExitCode(commandOptions: string | undefined): number{
        return this.hasDetailedExitCode(commandOptions) ? 2 : 0;
    }

    private setPlanHasChangesVariable(commandOptions: string | undefined, exitCode: number): void{
        let planHasChanges:boolean = exitCode === this.getPlanHasChangesExitCode(commandOptions);
        tasks.setVariable("TERRAFORM_PLAN_HAS_CHANGES", planHasChanges.toString(), false);
    }
}