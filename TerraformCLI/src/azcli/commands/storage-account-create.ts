import { HandleCommand } from "../command";
import { AzureCLI } from "../azure-cli";
import { Step, StepFrom } from "../step";
import { injectable, inject } from "inversify";
import { CommandPipeStep, CommandPipeFromStep } from "../command-pipe-step";

declare module "../step" {
    interface Step<TEvent> {
        azStorageAccountCreate<TPrevious>(this: Step<TPrevious>, command: CreateStorageAccount): StepFrom<TPrevious, StorageAccountCreated>;
    }
}

Step.prototype.azStorageAccountCreate = function<TPrevious>(this: Step<TPrevious>, command: CreateStorageAccount): StepFrom<TPrevious, StorageAccountCreated>{
    return new CommandPipeStep<TPrevious, CreateStorageAccount, StorageAccountCreated>(this, command);
}

export class StorageAccountCreated {
    id: string;
    location: string;
    name: string;
    constructor(id: string, location: string, name: string) {
        this.id = id;
        this.location = location;
        this.name = name;        
    }
}

export class CreateStorageAccount {
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
export class CreateStorageAccountHandler implements HandleCommand<CreateStorageAccount, StorageAccountCreated>{
    private readonly cli: AzureCLI;

    constructor(
        @inject(AzureCLI) cli: AzureCLI) {
        this.cli = cli;
    }
    
    execute(command: CreateStorageAccount): StorageAccountCreated {
        return this.cli.execJson<StorageAccountCreated>(`storage account create --name ${command.name} --resource-group ${command.resourceGroup} --sku ${command.sku} --kind ${command.kind} --encryption-services ${command.encryptionServices} --access-tier ${command.accessTier}`);
    }    
}