import { IHandleCommand, ICommand } from "../../commands";
import { AzureCLI } from "../azure-cli";
import { Step } from "../step";
import { AzureShell } from "../azure-shell";
import { CommandStep } from "../command-step";
import { injectable, inject } from "inversify";

declare module '../azure-shell'{
    interface AzureShell{
        azLogin(this: AzureShell, command: AzLogin) : Step<AzLoginResult>;
    }
}

AzureShell.prototype.azLogin = function(this: AzureShell, command: AzLogin) : Step<AzLoginResult> {
    return new CommandStep<AzLogin, AzLoginResult>(command);
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
    private readonly cli: AzureCLI;

    constructor(
        @inject(AzureCLI) cli: AzureCLI) {
        this.cli = cli;
    }

    execute(command: AzLogin): AzLoginResult {
        let rvalue = this.cli.execJson<AzLoginResult>(`login --service-principal -t "${command.tenantId}" -u "${command.clientId}" -p "${command.clientSecret}"`);        
        return rvalue;
    }    
}