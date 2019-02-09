import { Container, injectable, inject } from 'inversify';
import { ToolRunner } from "azure-pipelines-task-lib/toolrunner";
import { AzureBackendConfig } from './terraform-init';

export interface ICommand {
    name: string;
    workingDirectory: string;
}

export class TerraformCommand implements ICommand {
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

export interface IHandleCommand{
    execute(command: string): Promise<number>;
}

export interface IMediator{
    execute(command: string) : Promise<number>;
}

@injectable()
export class Mediator implements IMediator{
    private readonly container: Container;
    constructor(
        @inject("container") container: Container
    ) {
        this.container = container;
    }
    public async execute(command: string) : Promise<number> {
        let handler = this.container.getNamed<IHandleCommand>(TYPES.IHandleCommand, command);
        return await handler.execute(command);
    }

}

export interface ITerraformProvider{
    create(command?: TerraformCommand) : ToolRunner
}

@injectable()
export class TerraformProvider implements ITerraformProvider{
    private readonly tasks: any;
    constructor(tasks: any) {
        this.tasks = tasks
    }

    public create(command?: TerraformCommand): ToolRunner {
        let terraformPath = this.tasks.which("terraform", true);
        let terraform: ToolRunner = this.tasks.tool(terraformPath);
        if(command){
            terraform.arg(command.name);
            if(command.options){            
                terraform.line(command.options);
            }
        }        
        
        return terraform;
    }
}

export interface ITaskAgent{
    downloadSecureFile(secureFileId: string): Promise<string>
}

export interface IAzureContext{
    subscriptionId: string;
    tenantId: string;
    clientId: string;
    clientSecret: string;
}

export interface IAzureCliProvider{
    createAsync(context: IAzureContext) : Promise<IAzureCli>
}

@injectable()
export class AzureCliProvider implements IAzureCliProvider{    
    private readonly tasks: any;
    constructor(tasks: any) {
        this.tasks = tasks;
    }
    async createAsync(context: IAzureContext): Promise<IAzureCli> {
        let azurePath = this.tasks.which("az", true);
        let cli = new AzureCli(azurePath, this.tasks);
        await cli.login(context);
        await cli.accountSet(context.subscriptionId);
        return cli;   
    }    
}

export interface IAzureCli{
    login(command: IAzureContext): Promise<number>
    accountSet(subscriptionId: string): Promise<number>
}

export class AzureCli implements IAzureCli{
    private readonly azcliPath: string;
    private readonly tasks: any;
    constructor(azcliPath: string, tasks: any) {
        this.azcliPath = azcliPath;
        this.tasks = tasks;
    }
    async login(command: IAzureContext): Promise<number>{
        let cli = this.tasks.tool(this.azcliPath);
        cli.line(`login --service-principal -t "${command.tenantId}" -u "${command.clientId}" -p "${command.clientSecret}"`);
        return await cli.exec();        
    }
    async accountSet(subscriptionId: string): Promise<number>{
        let cli = this.tasks.tool(this.azcliPath);
        cli.line(`account set -s "${subscriptionId}"`);
        return await cli.exec();
    }
}



export const TYPES = {
    IMediator : Symbol("IMediator"),
    IHandleCommand : Symbol("IHandleCommand"),
    ITerraformProvider : Symbol("ITerraformProvider"),
    IAzureProvider : Symbol("IAzureProvider"),
    ITaskAgent: Symbol('ITaskAgent'),
    IAzureCliProvider: Symbol('IAzureCliProvider')
}
