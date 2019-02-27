import { IHandleCommand, ICommand } from "./command-handler";
import { AzRunner } from "./az-runner";
import { Step } from "./command-pipeline-step";
import { CommandPipeline } from "./command-pipeline";
import { Start } from "./command-pipeline-start";
import { injectable, inject } from "inversify";

declare module './command-pipeline'{
    interface CommandPipeline{
        azLogin(this: CommandPipeline, command: AzLogin) : Step<AzLoginResult>;
    }
}

CommandPipeline.prototype.azLogin = function(this: CommandPipeline, command: AzLogin) : Step<AzLoginResult> {
    return new Start<AzLogin, AzLoginResult>(command);
}

export class AzUser {
    constructor(name: string, type: string){
        this.name = name;
        this.type = type;
    }
    readonly name: string;
    readonly type: string;
}

export class AzSubscription {
    readonly cloudName: string;
    readonly id: string;
    readonly isDefault: boolean;
    readonly name: string;
    readonly state: string;
    readonly tenantId: string;
    readonly User: AzUser;
    constructor(cloudName: string, id: string, isDefault: boolean, name: string, state: string, tenantId: string, User: AzUser){
        this.cloudName = cloudName;
        this.id = id;
        this.isDefault = isDefault;
        this.name = name;
        this.state = state;
        this.tenantId = tenantId;
        this.User = User;
    }
}

export class AzLoginResult {
    readonly subscriptions: AzSubscription[]
    constructor(...subscriptions: AzSubscription[]) {
        this.subscriptions = subscriptions;
    }    
}

export class AzLogin implements ICommand<AzLoginResult>
{
    readonly clientSecret: string;
    readonly clientId: string;
    readonly tenantId: string;
    constructor(tenantId: string, clientId: string, clientSecret: string) {
        this.tenantId = tenantId;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }
    toString(): string {
        return `login --service-principal -t ${this.tenantId} -u ${this.clientId} -p ${this.clientSecret}`;
    }
}

@injectable()
export class AzLoginHandler implements IHandleCommand<AzLogin, AzLoginResult>
{
    private readonly cli: AzRunner;

    constructor(
        @inject(AzRunner) cli: AzRunner) {
        this.cli = cli;
    }

    execute(command: AzLogin): AzLoginResult {
        let rvalue = this.cli.execJson<AzLoginResult>(command.toString());        
        return rvalue;
    }    
}