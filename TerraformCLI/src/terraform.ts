import { IExecOptions } from "vsts-task-lib/toolrunner";
import { TerraformCommand } from "./terraform-command";
import { ITerraformProvider } from "./terraform-provider";

export class Terraform{
    private readonly terraformProvider: ITerraformProvider;

    constructor(terraformProvider: ITerraformProvider) {
        this.terraformProvider = terraformProvider;
    }

    public async verifyVersion(){
        var terraform = this.terraformProvider.create();
        console.log("Verifying Terraform version'");
        terraform.arg("version");
        return terraform.exec()
    }

    public async execute(command: TerraformCommand){
        var terraform = this.terraformProvider.create();
        terraform.arg(command.name);
        // todo: this should only be added for certain commands
        terraform.arg(`-var-file=${command.varsFile}`);
        return terraform.exec(<IExecOptions>{
            cwd: command.workingDirectory
        });
    }
}

