import { HandleCommand } from "../command";
import { AzureCLI } from "../azure-cli";
import { Step, StepFrom } from "../step";
import { injectable, inject } from "inversify";
import { CommandPipeStep, CommandPipeFromStep } from "../command-pipe-step";

declare module "../step" {
    interface Step<TResult> {
        azStorageAccountCreate<TPreviousResult>(this: Step<TPreviousResult>, command: StorageAccountCreate): StepFrom<TPreviousResult, StorageAccountCreateResult>;
    }
}

Step.prototype.azStorageAccountCreate = function<TPreviousResult>(this: Step<TPreviousResult>, command: StorageAccountCreate): StepFrom<TPreviousResult, StorageAccountCreateResult>{
    return new CommandPipeStep<TPreviousResult, StorageAccountCreate, StorageAccountCreateResult>(this, command);
}

export class StorageAccountCreateResult {
    id: string;
    location: string;
    name: string;
    constructor(id: string, location: string, name: string) {
        this.id = id;
        this.location = location;
        this.name = name;        
    }
}

export class StorageAccountCreate {
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
export class StorageAccountCreateHandler implements HandleCommand<StorageAccountCreate, StorageAccountCreateResult>{
    private readonly cli: AzureCLI;

    constructor(
        @inject(AzureCLI) cli: AzureCLI) {
        this.cli = cli;
    }
    
    execute(command: StorageAccountCreate): StorageAccountCreateResult {
        return this.cli.execJson<StorageAccountCreateResult>(`storage account create --name ${command.name} --resource-group ${command.resourceGroup} --sku ${command.sku} --kind ${command.kind} --encryption-services ${command.encryptionServices} --access-tier ${command.accessTier}`);
    }    
}