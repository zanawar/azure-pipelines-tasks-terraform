import { IHandleCommand, ICommand } from "./command-handler";
import { AzRunner } from "./az-runner";
import { Step, StepFrom } from "./command-pipeline-step";
import { injectable, inject } from "inversify";
import { Then } from "./command-pipeline-then";

declare module "./command-pipeline-step" {
    interface Step<TResult> {
        azGroupCreate<TPreviousResult>(this: Step<TPreviousResult>, command: AzGroupCreate): StepFrom<TPreviousResult, AzGroupCreateResult>;
    }
}

Step.prototype.azGroupCreate = function<TPreviousResult>(this: Step<TPreviousResult>, command: AzGroupCreate): StepFrom<TPreviousResult, AzGroupCreateResult>{
    return new Then<TPreviousResult, AzGroupCreate, AzGroupCreateResult>(this, command);
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
    toString() : string { 
        return `group create --name ${this.name} --location ${this.location}`; 
    }
}

@injectable()
export class AzGroupCreateHandler implements IHandleCommand<AzGroupCreate, AzGroupCreateResult>{
    private readonly cli: AzRunner;

    constructor(
        @inject(AzRunner) cli: AzRunner) {
        this.cli = cli;
    }
    
    execute(command: AzGroupCreate): AzGroupCreateResult {
        return this.cli.execJson<AzGroupCreateResult>(command.toString());
    }    
}