import { IHandleCommand, ICommand } from "../../commands";
import { AzureCLI } from "../azure-cli";
import { Step, StepFrom } from "../step";
import { injectable, inject } from "inversify";
import { CommandPipeStep } from "../command-pipe-step";

declare module "../step" {
    interface Step<TResult> {
        azStorageAccountCreate<TPreviousResult>(this: Step<TPreviousResult>, command: AzStorageAccountCreate): StepFrom<TPreviousResult, AzStorageAccountCreateResult>;
    }
}

Step.prototype.azStorageAccountCreate = function<TPreviousResult>(this: Step<TPreviousResult>, command: AzStorageAccountCreate): StepFrom<TPreviousResult, AzStorageAccountCreateResult>{
    return new CommandPipeStep<TPreviousResult, AzStorageAccountCreate, AzStorageAccountCreateResult>(this, command);
}

export class AzStorageAccountCreateResult {
    id: string;
    location: string;
    name: string;
    constructor(id: string, location: string, name: string) {
        this.id = id;
        this.location = location;
        this.name = name;        
    }
}

export class AzStorageAccountCreate implements ICommand<AzStorageAccountCreateResult> {
    readonly name: string;
    readonly resourceGroup: string;
    readonly sku: string;
    readonly kind: string;
    readonly encryptionServices: string;
    readonly accessTier: string;
    constructor(name: string, resourceGroup: string, sku: string, kind: string = "BlobStorage", encryptionServices: string = "blob", accessTier: string = "hot") {
        this.name = name;
        this.resourceGroup = resourceGroup;
        this.sku = sku;
        this.kind = kind;
        this.encryptionServices = encryptionServices;
        this.accessTier = accessTier;
    }
}

@injectable()
export class AzStorageAccountCreateHandler implements IHandleCommand<AzStorageAccountCreate, AzStorageAccountCreateResult>{
    private readonly cli: AzureCLI;

    constructor(
        @inject(AzureCLI) cli: AzureCLI) {
        this.cli = cli;
    }
    
    execute(command: AzStorageAccountCreate): AzStorageAccountCreateResult {
        return this.cli.execJson<AzStorageAccountCreateResult>(`storage account create --name ${command.name} --resource-group ${command.resourceGroup} --sku ${command.sku} --kind ${command.kind} --encryption-services ${command.encryptionServices} --access-tier ${command.accessTier}`);
    }    
}