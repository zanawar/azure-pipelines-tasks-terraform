import { IHandleCommand, ICommand } from "../../commands";
import { AzureCLI } from "../azure-cli";
import { Step, StepFrom } from "../step";
import { injectable, inject } from "inversify";
import { CommandPipeStep, CommandPipeFromStep } from "../command-pipe-step";

declare module "../step" {
    interface Step<TResult> {
        azStorageAccountKeysList<TPreviousResult>(this: Step<TPreviousResult>, command: AzStorageAccountKeysList): StepFrom<TPreviousResult, AzStorageAccountKeysListResult>;
    }
}

Step.prototype.azStorageAccountKeysList = function<TPreviousResult>(this: Step<TPreviousResult>, command: AzStorageAccountKeysList): StepFrom<TPreviousResult, AzStorageAccountKeysListResult>{
    return new CommandPipeStep<TPreviousResult, AzStorageAccountKeysList, AzStorageAccountKeysListResult>(this, command);
}

export class AzStorageAccountKey {
    readonly keyName: string;
    readonly permissions: string;
    readonly value: string;
    constructor(keyName: string, permissions: string, value: string) {
        this.keyName = keyName;
        this.permissions = permissions;
        this.value = value;
    }
}

export class AzStorageAccountKeysListResult {
    readonly keys: AzStorageAccountKey[];    
    constructor(keys: AzStorageAccountKey[]) {
        this.keys = keys;        
    }
}

export class AzStorageAccountKeysList implements ICommand<AzStorageAccountKeysListResult> {
    readonly accountName: string;
    readonly resourceGroup: string;
    constructor(accountName: string, resourceGroup: string) {
        this.accountName = accountName;
        this.resourceGroup = resourceGroup;
    }
}

@injectable()
export class AzStorageAccountKeysListHandler implements IHandleCommand<AzStorageAccountKeysList, AzStorageAccountKeysListResult>{
    private readonly cli: AzureCLI;

    constructor(
        @inject(AzureCLI) cli: AzureCLI) {
        this.cli = cli;
    }
    
    execute(command: AzStorageAccountKeysList): AzStorageAccountKeysListResult {
        let keys: AzStorageAccountKey[] = this.cli.execJson<AzStorageAccountKey[]>(`storage account keys list --account-name ${command.accountName} --resource-group ${command.resourceGroup}`);
        return new AzStorageAccountKeysListResult(keys);
    }    
}