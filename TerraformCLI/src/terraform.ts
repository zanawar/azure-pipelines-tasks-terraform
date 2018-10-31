import { IExecOptions } from "azure-pipelines-task-lib/toolrunner";
import { TerraformCommand } from "./terraform-command";
import { ITerraformProvider } from "./terraform-provider";
import tasks = require("azure-pipelines-task-lib/task");

export class Terraform{
    private readonly terraformProvider: ITerraformProvider;

    constructor(terraformProvider: ITerraformProvider) {
        this.terraformProvider = terraformProvider;
    }

    public async verifyVersion(){
        var terraform = this.terraformProvider.create();
        console.log("Verifying Terraform version");
        terraform.arg("version");
        return terraform.exec()
    }

    public async execute(command: TerraformCommand){
        console.log("Executing terraform command: ", command);
        var terraform = this.terraformProvider.create();
        terraform.arg(command.name);
        // todo: this should only be added for certain commands
        if(command.varsFile && command.name != "init") {
            terraform.arg(`-var-file=${command.varsFile}`);
        }
        
        if(command.connectedServiceNameARM){
            let scheme = tasks.getEndpointAuthorizationScheme(command.connectedServiceNameARM, false);
            if(scheme != "ServicePrincipal"){
                throw "Terraform only supports service principal authorization for azure";
            }

            process.env['ARM_SUBSCRIPTION_ID'] = tasks.getEndpointDataParameter(command.connectedServiceNameARM, "subscriptionid", false);
            process.env['ARM_TENANT_ID'] = tasks.getEndpointAuthorizationParameter(command.connectedServiceNameARM, "tenantid", false);
            process.env['ARM_CLIENT_ID'] = tasks.getEndpointAuthorizationParameter(command.connectedServiceNameARM, "serviceprincipalid", false);
            process.env['ARM_CLIENT_SECRET'] = tasks.getEndpointAuthorizationParameter(command.connectedServiceNameARM, "serviceprincipalkey", false);
        }
        
        return terraform.exec(<IExecOptions>{
            cwd: command.workingDirectory
        });
    }
}

