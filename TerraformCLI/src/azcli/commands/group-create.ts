import { HandleCommand } from "../command";
import { AzureCLI } from "../azure-cli";
import { Step, StepFrom } from "../step";
import { injectable, inject } from "inversify";
import { CommandPipeStep } from "../command-pipe-step";

declare module "../step" {
    interface Step<TResult> {
        azGroupCreate<TPreviousResult>(this: Step<TPreviousResult>, command: GroupCreate): StepFrom<TPreviousResult, GroupCreateResult>;
    }
}

Step.prototype.azGroupCreate = function<TPreviousResult>(this: Step<TPreviousResult>, command: GroupCreate): StepFrom<TPreviousResult, GroupCreateResult>{
    return new CommandPipeStep<TPreviousResult, GroupCreate, GroupCreateResult>(this, command);
}

export class GroupCreateResult {
    id: string;
    location: string;
    name: string;
    constructor(id: string, location: string, name: string) {
        this.id = id;
        this.location = location;
        this.name = name;        
    }
}

export class GroupCreate {
    readonly location: string;
    readonly name: string;
    constructor(name: string, location: string) {
        this.name = name;
        this.location = location;
    }
}

@injectable()
export class GroupCreateHandler implements HandleCommand<GroupCreate, GroupCreateResult>{
    private readonly cli: AzureCLI;

    constructor(
        @inject(AzureCLI) cli: AzureCLI) {
        this.cli = cli;
    }
    
    execute(command: GroupCreate): GroupCreateResult {
        return this.cli.execJson<GroupCreateResult>(`group create --name ${command.name} --location ${command.location}`);
    }    
}