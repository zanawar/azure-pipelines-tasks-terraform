import tasks = require("azure-pipelines-task-lib/task");
import { IExecOptions, ToolRunner } from "azure-pipelines-task-lib/toolrunner";
import { TerraformCommand, TerraformInterfaces, ITerraformProvider, ITaskAgent, ILogger } from "./terraform";
import { IHandleCommandString } from "./command-handler";
import { injectable, inject } from "inversify";

export class TerraformPlan extends TerraformCommand{
    readonly secureVarsFile: string | undefined;
    readonly environmentServiceName: string;

    constructor(
        name: string, 
        workingDirectory: string,
        environmentServiceName: string, 
        options?: string, 
        secureVarsFile?: string) {
        super(name, workingDirectory, options);
        this.environmentServiceName = environmentServiceName;
        this.secureVarsFile = secureVarsFile;
    }
}

@injectable()
export class TerraformPlanHandler implements IHandleCommandString{
    private readonly terraformProvider: ITerraformProvider;
    private readonly taskAgent: ITaskAgent;
    private readonly log: ILogger;

    constructor(
        @inject(TerraformInterfaces.ITerraformProvider) terraformProvider: ITerraformProvider,
        @inject(TerraformInterfaces.ITaskAgent) taskAgent: ITaskAgent,
        @inject(TerraformInterfaces.ILogger) log: ILogger
    ) {
        this.terraformProvider = terraformProvider;        
        this.taskAgent = taskAgent;   
        this.log = log;
    }

    public async execute(command: string): Promise<number> {
        let plan = new TerraformPlan(
            command,
            tasks.getInput("workingDirectory"),
            tasks.getInput("environmentServiceName", true),
            tasks.getInput("commandOptions"),
            tasks.getInput("secureVarsFile")
        );

        let loggedProps = {
            "secureVarsFileDefined": plan.secureVarsFile !== undefined,
            "commandOptionsDefined": plan.options !== undefined
        }
        
        return this.log.command(plan, (command: TerraformPlan) => this.onExecute(command), loggedProps);
    }

    private async onExecute(command: TerraformPlan): Promise<number> {
        var terraform = this.terraformProvider.create(command);
        this.setupAzureRmProvider(command, terraform);
        await this.setupVars(command, terraform);
        
        let execOptions: IExecOptions = <IExecOptions>{
            cwd: command.workingDirectory,
            // if using detailed exit code, disable automated interpretation of exit codes by the toolrunner so exit code 2 doesn't return error
            ignoreReturnCode: this.hasDetailedExitCode(command.options)
        };

        let exitCode = await terraform.exec(execOptions);

        this.setPlanHasChangesVariable(command.options, exitCode);

        // ensure exit code 1 still throws error so task result is set to Failed. 
        if(execOptions.ignoreReturnCode && exitCode === 1){
            throw "terraform plan failed with exit code 1";
        }

        return exitCode;
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

    private async setupVars(command: TerraformPlan, terraform: ToolRunner){
        if(command.secureVarsFile){
            const secureFilePath = await this.taskAgent.downloadSecureFile(command.secureVarsFile);
            terraform.arg(`-var-file=${secureFilePath}`);
        }
    }

    private setupAzureRmProvider(command: TerraformPlan, terraform: ToolRunner){
        if(command.environmentServiceName){
            let scheme = tasks.getEndpointAuthorizationScheme(command.environmentServiceName, true);
            if(scheme != "ServicePrincipal"){
                throw "Terraform only supports service principal authorization for azure";
            }

            process.env['ARM_SUBSCRIPTION_ID']  = tasks.getEndpointDataParameter(command.environmentServiceName, "subscriptionid", false);
            process.env['ARM_TENANT_ID']        = tasks.getEndpointAuthorizationParameter(command.environmentServiceName, "tenantid", false);
            process.env['ARM_CLIENT_ID']        = tasks.getEndpointAuthorizationParameter(command.environmentServiceName, "serviceprincipalid", false);
            process.env['ARM_CLIENT_SECRET']    = tasks.getEndpointAuthorizationParameter(command.environmentServiceName, "serviceprincipalkey", false);
        }
        
    }
}