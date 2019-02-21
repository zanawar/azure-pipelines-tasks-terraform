import tasks = require("azure-pipelines-task-lib/task");
import { IExecOptions, ToolRunner } from "azure-pipelines-task-lib/toolrunner";
import { TerraformCommand, TerraformInterfaces, ITerraformProvider, ITaskAgent } from "./terraform";
import { IHandleCommandString } from "./commands";
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

    constructor(
        @inject(TerraformInterfaces.ITerraformProvider) terraformProvider: ITerraformProvider,
        @inject(TerraformInterfaces.ITaskAgent) taskAgent: ITaskAgent
    ) {
        this.terraformProvider = terraformProvider;        
        this.taskAgent = taskAgent;
    }

    public async execute(command: string): Promise<number> {
        let init = new TerraformPlan(
            command,
            tasks.getInput("workingDirectory"),
            tasks.getInput("environmentServiceName", true),
            tasks.getInput("commandOptions"),
            tasks.getInput("secureVarsFile")
        );
        return this.onExecute(init);
    }

    private async onExecute(command: TerraformPlan): Promise<number> {
        var terraform = this.terraformProvider.create(command);
        this.setupAzureRmProvider(command, terraform);
        await this.setupVars(command, terraform);
        return terraform.exec(<IExecOptions>{
            cwd: command.workingDirectory
        });
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