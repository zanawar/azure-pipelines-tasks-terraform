import { TerraformInterfaces, ITerraformProvider } from "./terraform";
import { IHandleCommand } from "./commands";
import { injectable, inject } from "inversify";

@injectable()
export class TerraformVersionHandler implements IHandleCommand{
    private readonly terraformProvider: ITerraformProvider;

    constructor(
        @inject(TerraformInterfaces.ITerraformProvider) terraformProvider: ITerraformProvider
    ) {
        this.terraformProvider = terraformProvider;        
    }

    public async execute(command: string): Promise<number> {
        var terraform = this.terraformProvider.create();
        terraform.arg(command);
        return terraform.exec();
    }
}