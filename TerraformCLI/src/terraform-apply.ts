import tasks = require("azure-pipelines-task-lib/task");
import { IExecOptions, ToolRunner } from "azure-pipelines-task-lib/toolrunner";
import { IHandleCommand, TerraformCommand, TYPES, ITerraformProvider } from "./terraform";
import { injectable, inject } from "inversify";

export class TerraformApply extends TerraformCommand{
    readonly varsFile: string | undefined;
    readonly environmentServiceName: string;

    constructor(
        name: string, 
        workingDirectory: string,
        environmentServiceName: string, 
        varsFile: string | undefined) {
        super(name, workingDirectory);
        this.environmentServiceName = environmentServiceName;
        if(varsFile != workingDirectory){
            this.varsFile = varsFile;
        }            
    }
}

@injectable()
export class TerraformApplyHandler implements IHandleCommand{
    private readonly terraformProvider: ITerraformProvider;

    constructor(
        @inject(TYPES.ITerraformProvider) terraformProvider: ITerraformProvider
    ) {
        this.terraformProvider = terraformProvider;        
    }

    public async execute(command: string): Promise<number> {
        let init = new TerraformApply(
            command,
            tasks.getInput("workingDirectory"),
            tasks.getInput("environmentServiceName", true),
            tasks.getInput("varsFile")
        );
        return this.onExecute(init);
    }

    private async onExecute(command: TerraformApply): Promise<number> {
        var terraform = this.terraformProvider.create();
        terraform.arg(command.name);
        terraform.arg("-auto-approve");
        this.setupAzureRmProvider(command, terraform);
        this.setupVars(command, terraform);

        return terraform.exec(<IExecOptions>{
            cwd: command.workingDirectory
        });
    }

    private setupVars(command: TerraformApply, terraform: ToolRunner){
        if(command.varsFile){
            terraform.arg(`-var-file=${command.varsFile}`);
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