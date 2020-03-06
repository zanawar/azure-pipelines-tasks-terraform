import { ICommand } from "./command-handler";

export class TerraformCommand {
    public readonly name: string;
    public readonly options: string | undefined;
    public readonly workingDirectory: string;
    constructor(
        name: string,
        workingDirectory: string,
        options?: string) {
        this.name = name;
        this.workingDirectory = workingDirectory;
        this.options = options;
    }
}

export class TerraformExecResult {
    public readonly stdout: string;
    public readonly stderr: string;
    public readonly exitCode: number;
    constructor(
        stdout: string,
        stderr: string,
        exitCode: number,
    ){
        this.stdout = stdout;
        this.stderr = stderr;
        this.exitCode = exitCode;
    }
}

export interface TaskInput{
    command: string;
    name: string;
    workingDirectory: string;
    environmentServiceName?: string | null;
    secureVarsFile?: string | null;
    commandOptions?: string;
    options?: string;
    backendType?: string | null;
    backendServiceArm?: string | null;
    ensureBackend?: boolean | null;
    backendAzureRmResourceGroupName? : string | null;
    backendAzureRmResourceGroupLocation? : string | null;
    backendAzureRmStorageAccountName? : string | null;
    backendAzureRmStorageAccountSku? : string | null;
    backendAzureRmContainerName? : string | null;
    backendAzureRmKey? : string | null;
    aiInstrumentationKey? : string | null;
}

export interface ITaskAgent {
    downloadSecureFile(secureFileId: string): Promise<string>
}

export interface ILogger {
    command<TCommand extends TerraformCommand>(command: TCommand, handler: (command: TCommand) => Promise<number>, properties: any) : Promise<number>;
    command<TCommand extends ICommand<TResult>, TResult> (command: TCommand, handler: (command: TCommand) => Promise<TResult>, properties: any) : Promise<number>;
    debug(message: string): void;
    error(message: string): void;
}

export const TerraformInterfaces = {
    ITaskAgent: Symbol('ITaskAgent'),
    ILogger: Symbol('ILogger')
}
