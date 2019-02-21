import tasks = require("azure-pipelines-task-lib/task");
import { IExecOptions, ToolRunner } from "azure-pipelines-task-lib/toolrunner";
import { TerraformCommand, TerraformInterfaces, ITerraformProvider, ITaskAgent } from "./terraform";
import { injectable, inject } from "inversify";
import { IHandleCommand } from "./commands";

export class TerraformApply extends TerraformCommand{
    readonly secureVarsFile: string | undefined;
    readonly environmentServiceName: string;

    constructor(
        name: string, 
        workingDirectory: string,
        environmentServiceName: string, 
        secureVarsFile: string | undefined,
        options?: string) {
        super(name, workingDirectory, options);
        this.environmentServiceName = environmentServiceName;
        this.secureVarsFile = secureVarsFile;
    }
}

@injectable()
export class TerraformApplyHandler implements IHandleCommand{
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
        let init = new TerraformApply(
            command,
            tasks.getInput("workingDirectory"),
            tasks.getInput("environmentServiceName", true),
            tasks.getInput("secureVarsFile"),
            tasks.getInput("commandOptions")
        );
        return this.onExecute(init);
    }

    private async onExecute(command: TerraformApply): Promise<number> {
        let terraform: ToolRunner = this.terraformProvider.create(command);
        if((<any>terraform).args.indexOf("-auto-approve") < 0)
            terraform.arg("-auto-approve");
        this.setupAzureRmProvider(command, terraform);
        await this.setupVars(command, terraform);

        return terraform.exec(<IExecOptions>{
            cwd: command.workingDirectory
        });
    }

    private async setupVars(command: TerraformApply, terraform: ToolRunner){
        if(command.secureVarsFile){
            const secureFilePath = await this.taskAgent.downloadSecureFile(command.secureVarsFile);
            terraform.arg(`-var-file=${secureFilePath}`);
        }
    }

    private setupAzureRmProvider(command: TerraformApply, terraform: ToolRunner){
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