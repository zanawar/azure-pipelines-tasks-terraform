import { IHandleCommand, ICommand } from "./command-handler";
import { AzRunner } from "./az-runner";
import { Step, StepFrom } from "./command-pipeline-step";
import { injectable, inject } from "inversify";
import { Then } from "./command-pipeline-then";
import { TerraformInterfaces, ILogger } from "./terraform";

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
    constructor(name: string, resourceGroup: string, sku: string, kind: string = "StorageV2", encryptionServices: string = "blob", accessTier: string = "hot") {
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

export class AzStorageAccountShowResult {
    id: string;
    location: string;
    name: string;
    constructor(id: string, location: string, name: string) {
        this.id = id;
        this.location = location;
        this.name = name;        
    }
}

export class AzStorageAccountShow implements ICommand<AzStorageAccountShowResult> {
    readonly name: string;
    readonly resourceGroup: string;
    constructor(name: string, resourceGroup: string) {
        this.name = name;
        this.resourceGroup = resourceGroup;
    }

    toString() : string {
        return `storage account show --name ${this.name} --resource-group ${this.resourceGroup}`
    }
}

@injectable()
export class AzStorageAccountCreateHandler implements IHandleCommand<AzStorageAccountCreate, AzStorageAccountCreateResult>{
    private readonly cli: AzRunner;
    private readonly log: ILogger;

    constructor(
        @inject(AzRunner) cli: AzRunner,
        @inject(TerraformInterfaces.ILogger) log: ILogger) {
        this.cli = cli;
        this.log = log;
    }
    
    execute(command: AzStorageAccountCreate): AzStorageAccountCreateResult {        
        let azStorageAccountShow: AzStorageAccountShow = new AzStorageAccountShow(command.name, command.resourceGroup)
        let result: AzStorageAccountShowResult | undefined = undefined;
        try{
            result = this.cli.execJson<AzStorageAccountShowResult>(azStorageAccountShow.toString());
        }
        catch(e){
            let expectedError: string = `The Resource 'Microsoft.Storage/storageAccounts/${command.name}' under resource group '${command.resourceGroup}' was not found`;
            if(e.message.includes(expectedError)){
                this.log.debug("az storage account create: storage account not found, creating...");    
            }
            else
                throw e;
        }
        
        if(result){
            this.log.debug("az storage account create: storage account already exists");
            return new AzStorageAccountCreateResult(result.id, result.location, result.name);
        }            
        else            
            return this.cli.execJson<AzStorageAccountCreateResult>(command.toString());
    }    
}
