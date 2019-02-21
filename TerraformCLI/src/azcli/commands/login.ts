import { IHandleCommand, ICommand } from "../../commands";
import { AzureCLI } from "../azure-cli";
import { Step } from "../step";
import { AzureShell } from "../azure-shell";
import { CommandStep } from "../command-step";
import { injectable, inject } from "inversify";

declare module '../azure-shell'{
    interface AzureShell{
        azLogin(this: AzureShell, command: Login) : Step<LoginResult>;
    }
}

AzureShell.prototype.azLogin = function(this: AzureShell, command: Login) : Step<LoginResult> {
    return new CommandStep<Login, LoginResult>(command);
}

interface User {
    name: string;
    type: string;
}

interface Subscription {
    cloudName: string;
    id: string;
    isDefault: boolean;
    name: string;
    state: string;
    tenantId: string;
    User: User;
}

export interface LoginResult {
    subscriptions: Subscription[]
}

export class Login implements ICommand<LoginResult>
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
export class LoginHandler implements IHandleCommand<Login, LoginResult>
{
    private readonly cli: AzureCLI;

    constructor(
        @inject(AzureCLI) cli: AzureCLI) {
        this.cli = cli;
    }

    execute(command: Login): LoginResult {
        let rvalue = this.cli.execJson<LoginResult>(`login --service-principal -t "${command.tenantId}" -u "${command.clientId}" -p "${command.clientSecret}"`);        
        return rvalue;
    }    
}