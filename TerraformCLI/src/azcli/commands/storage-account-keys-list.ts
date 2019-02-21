import { HandleCommand, ICommand } from "../command";
import { AzureCLI } from "../azure-cli";
import { Step, StepFrom } from "../step";
import { injectable, inject } from "inversify";
import { CommandPipeStep, CommandPipeFromStep } from "../command-pipe-step";

declare module "../step" {
    interface Step<TResult> {
        azStorageAccountKeysList<TPreviousResult>(this: Step<TPreviousResult>, command: StorageAccountKeysList): StepFrom<TPreviousResult, StorageAccountKeysListResult>;
    }
}

Step.prototype.azStorageAccountKeysList = function<TPreviousResult>(this: Step<TPreviousResult>, command: StorageAccountKeysList): StepFrom<TPreviousResult, StorageAccountKeysListResult>{
    return new CommandPipeStep<TPreviousResult, StorageAccountKeysList, StorageAccountKeysListResult>(this, command);
}

export class StorageAccountKey {
    readonly keyName: string;
    readonly permissions: string;
    readonly value: string;
    constructor(keyName: string, permissions: string, value: string) {
        this.keyName = keyName;
        this.permissions = permissions;
        this.value = value;
    }
}

export class StorageAccountKeysListResult {
    readonly keys: StorageAccountKey[];    
    constructor(keys: StorageAccountKey[]) {
        this.keys = keys;        
    }
}

export class StorageAccountKeysList implements ICommand<StorageAccountKeysListResult> {
    readonly accountName: string;
    readonly resourceGroup: string;
    constructor(accountName: string, resourceGroup: string) {
        this.accountName = accountName;
        this.resourceGroup = resourceGroup;
    }
}

@injectable()
export class StorageAccountKeysListHandler implements HandleCommand<StorageAccountKeysList, StorageAccountKeysListResult>{
    private readonly cli: AzureCLI;

    constructor(
        @inject(AzureCLI) cli: AzureCLI) {
        this.cli = cli;
    }
    
    execute(command: StorageAccountKeysList): StorageAccountKeysListResult {
        let keys: StorageAccountKey[] = this.cli.execJson<StorageAccountKey[]>(`storage account keys list --account-name ${command.accountName} --resource-group ${command.resourceGroup}`);
        return new StorageAccountKeysListResult(keys);
    }    
}