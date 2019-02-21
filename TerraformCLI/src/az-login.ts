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

interface AzUser {
    name: string;
    type: string;
}

interface AzSubscription {
    cloudName: string;
    id: string;
    isDefault: boolean;
    name: string;
    state: string;
    tenantId: string;
    User: AzUser;
}

export interface AzLoginResult {
    subscriptions: AzSubscription[]
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
        let rvalue = this.cli.execJson<AzLoginResult>(`login --service-principal -t "${command.tenantId}" -u "${command.clientId}" -p "${command.clientSecret}"`);        
        return rvalue;
    }    
}