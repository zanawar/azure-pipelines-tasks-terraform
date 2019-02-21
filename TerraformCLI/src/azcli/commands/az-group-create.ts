import { IHandleCommand, ICommand } from "../../commands";
import { AzureCLI } from "../azure-cli";
import { Step, StepFrom } from "../step";
import { injectable, inject } from "inversify";
import { CommandPipeStep } from "../command-pipe-step";

declare module "../step" {
    interface Step<TResult> {
        azGroupCreate<TPreviousResult>(this: Step<TPreviousResult>, command: AzGroupCreate): StepFrom<TPreviousResult, AzGroupCreateResult>;
    }
}

Step.prototype.azGroupCreate = function<TPreviousResult>(this: Step<TPreviousResult>, command: AzGroupCreate): StepFrom<TPreviousResult, AzGroupCreateResult>{
    return new CommandPipeStep<TPreviousResult, AzGroupCreate, AzGroupCreateResult>(this, command);
}

export class AzGroupCreateResult {
    id: string;
    location: string;
    name: string;
    constructor(id: string, location: string, name: string) {
        this.id = id;
        this.location = location;
        this.name = name;        
    }
}

export class AzGroupCreate implements ICommand<AzGroupCreateResult> {
    readonly location: string;
    readonly name: string;
    constructor(name: string, location: string) {
        this.name = name;
        this.location = location;
    }
}

@injectable()
export class AzGroupCreateHandler implements IHandleCommand<AzGroupCreate, AzGroupCreateResult>{
    private readonly cli: AzureCLI;

    constructor(
        @inject(AzureCLI) cli: AzureCLI) {
        this.cli = cli;
    }
    
    execute(command: AzGroupCreate): AzGroupCreateResult {
        return this.cli.execJson<AzGroupCreateResult>(`group create --name ${command.name} --location ${command.location}`);
    }    
}