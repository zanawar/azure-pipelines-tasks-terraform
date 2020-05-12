import tasks = require("azure-pipelines-task-lib/task");
import { TerraformCommand, TerraformInterfaces, ITaskAgent, ILogger } from "./terraform";
import { IHandleCommandString } from "./command-handler";
import { injectable, inject } from "inversify";
import { TerraformRunner, TerraformCommandDecorator, TerraformCommandBuilder, TerraformCommandContext } from "./terraform-runner";

export class TerraformImport extends TerraformCommand{
    readonly inputTargetPlanOrStateFilePath: string |undefined;
    readonly environmentServiceName: string;
    readonly resourceAddress: string;
    readonly resourceId: string;
    readonly secureVarsFile: string | undefined;

    constructor(
        name: string, 
        workingDirectory: string,
        environmentServiceName: string,
        resourceAddress: string,
        resourceId: string,
        options?: string,
        secureVarsFile?: string){
        super(name, workingDirectory, options);
        this.environmentServiceName = environmentServiceName;
        this.resourceAddress = resourceAddress;
        this.resourceId = resourceId;
        this.secureVarsFile = secureVarsFile;
    }
}

declare module "./terraform-runner" {
    interface TerraformRunner{
        withResourceImport(this: TerraformRunner, resourceAddress: string, resourceId: string): TerraformRunner;
    }
}

export class TerraformWithResourceImport extends TerraformCommandDecorator{
    private readonly resourceAddress: string;
    private readonly resourceId: string;
    constructor(builder: TerraformCommandBuilder, resourceAddress: string, resourceId: string) {
        super(builder);
        this.resourceAddress = resourceAddress;
        this.resourceId = resourceId;
    }
    async onRun(context: TerraformCommandContext): Promise<void> {            
        context.terraform.arg([
            this.resourceAddress,
            this.resourceId
        ]);
    }
}

TerraformRunner.prototype.withResourceImport = function(this: TerraformRunner, resourceAddress: string, resourceId: string): TerraformRunner {
    return this.with((builder) => new TerraformWithResourceImport(builder, resourceAddress, resourceId));
}

@injectable()
export class TerraformImportHandler implements IHandleCommandString{
    private readonly taskAgent: ITaskAgent;
    private readonly log: ILogger;

    constructor(
        @inject(TerraformInterfaces.ITaskAgent) taskAgent: ITaskAgent,
        @inject(TerraformInterfaces.ILogger) log: ILogger
    ) {
        this.taskAgent = taskAgent;   
        this.log = log;
    }


    public async execute(command: string): Promise<number> {
        let tfImport = new TerraformImport(
            command,
            tasks.getInput("workingDirectory"),   
            tasks.getInput("environmentServiceName", true),
            tasks.getInput("resourceAddress", true),
            tasks.getInput("resourceId", true),
            tasks.getInput("commandOptions"),
            tasks.getInput("secureVarsFile")
        );
        
        let loggedProps = {
            "secureVarsFileDefined": tfImport.secureVarsFile !== undefined && tfImport.secureVarsFile !== '' && tfImport.secureVarsFile !== null,
            "commandOptionsDefined": tfImport.options !== undefined && tfImport.options !== '' && tfImport.options !== null,
        }   
        return this.log.command(tfImport, (command: TerraformImport) => this.onExecute(command), loggedProps);       
    }

    
    private async onExecute(command: TerraformImport): Promise<number> {
        let exitCode = await new TerraformRunner(command)
            .withAzureRmProvider(command.environmentServiceName)
            .withSecureVarsFile(this.taskAgent, command.secureVarsFile)
            .withOptions()
            .withResourceImport(command.resourceAddress, command.resourceId)            
            .exec();
        
        return exitCode;
    }
}