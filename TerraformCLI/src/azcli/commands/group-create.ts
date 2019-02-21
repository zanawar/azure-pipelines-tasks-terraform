import { HandleCommand } from "../command";
import { AzureCLI } from "../azure-cli";
import { Step, StepFrom } from "../step";
import { injectable, inject } from "inversify";
import { CommandPipeStep } from "../command-pipe-step";

declare module "../step" {
    interface Step<TEvent> {
        azGroupCreate<TPrevious>(this: Step<TPrevious>, command: CreateGroup): StepFrom<TPrevious, GroupCreated>;
    }
}

Step.prototype.azGroupCreate = function<TPrevious>(this: Step<TPrevious>, command: CreateGroup): StepFrom<TPrevious, GroupCreated>{
    return new CommandPipeStep<TPrevious, CreateGroup, GroupCreated>(this, command);
}

export class GroupCreated {
    id: string;
    location: string;
    name: string;
    constructor(id: string, location: string, name: string) {
        this.id = id;
        this.location = location;
        this.name = name;        
    }
}

export class CreateGroup {
    readonly location: string;
    readonly name: string;
    constructor(name: string, location: string) {
        this.name = name;
        this.location = location;
    }
}

@injectable()
export class CreateGroupHandler implements HandleCommand<CreateGroup, GroupCreated>{
    private readonly cli: AzureCLI;

    constructor(
        @inject(AzureCLI) cli: AzureCLI) {
        this.cli = cli;
    }
    
    execute(command: CreateGroup): GroupCreated {
        return this.cli.execJson<GroupCreated>(`group create --name ${command.name} --location ${command.location}`);
    }    
}