export class TerraformCommand {
    public readonly name: string;
    public readonly options: string | undefined;
    public readonly workingDirectory: string;
    public readonly isSilent: boolean | undefined;
    constructor(
        name: string,
        workingDirectory: string,
        options?: string,
        isSilent?:boolean) {
        this.name = name;
        this.workingDirectory = workingDirectory;
        this.options = options;
        this.isSilent = isSilent;
    }
}

export interface ITaskAgent {
    downloadSecureFile(secureFileId: string): Promise<string>
}

export interface ILogger {
    command<TCommand extends TerraformCommand>(command: TCommand, handler: (command: TCommand) => Promise<number>, properties: any) : Promise<number>;
    debug(message: string): void;
    error(message: string): void;
}

export const TerraformInterfaces = {
    ITaskAgent: Symbol('ITaskAgent'),
    ILogger: Symbol('ILogger')
}
