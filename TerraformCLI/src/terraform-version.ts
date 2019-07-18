import { TerraformInterfaces, ITerraformProvider } from "./terraform";
import { IHandleCommandString } from "./command-handler";
import { injectable, inject } from "inversify";

@injectable()
export class TerraformVersionHandler implements IHandleCommandString{
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