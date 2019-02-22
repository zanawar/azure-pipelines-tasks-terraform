import { IHandleCommand, ICommand } from "./command-handler";
import { AzRunner } from "./az-runner";
import { Step, StepFrom } from "./command-pipeline-step";
import { injectable, inject } from "inversify";
import { Then } from "./command-pipeline-then";

declare module "./command-pipeline-step" {
    interface Step<TResult> {
        azStorageAccountCreate<TPreviousResult>(this: Step<TPreviousResult>, command: AzStorageAccountCreate): StepFrom<TPreviousResult, AzStorageAccountCreateResult>;
    }
}

Step.prototype.azStorageAccountCreate = function<TPreviousResult>(this: Step<TPreviousResult>, command: AzStorageAccountCreate): StepFrom<TPreviousResult, AzStorageAccountCreateResult>{
    return new Then<TPreviousResult, AzStorageAccountCreate, AzStorageAccountCreateResult>(this, command);
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

    toString() : string {
        return `storage account create --name ${this.name} --resource-group ${this.resourceGroup} --sku ${this.sku} --kind ${this.kind} --encryption-services ${this.encryptionServices} --access-tier ${this.accessTier}`
    }
}

@injectable()
export class AzStorageAccountCreateHandler implements IHandleCommand<AzStorageAccountCreate, AzStorageAccountCreateResult>{
    private readonly cli: AzRunner;

    constructor(
        @inject(AzRunner) cli: AzRunner) {
        this.cli = cli;
    }
    
    execute(command: AzStorageAccountCreate): AzStorageAccountCreateResult {
        return this.cli.execJson<AzStorageAccountCreateResult>(command.toString());
    }    
}