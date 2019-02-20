import { ICommand, HandleCommand } from "../command";
import { AzureCLI } from "../azure-cli";
import { Step } from "../step";
import { AzureShell } from "../azure-shell";
import { CommandStep } from "../command-step";
import { injectable, inject } from "inversify";

declare module '../azure-shell'{
    interface AzureShell{
        azLogin(this: AzureShell, command: Login) : Step<LoggedIn>;
    }
}

AzureShell.prototype.azLogin = function(this: AzureShell, command: Login) : Step<LoggedIn> {
    return new CommandStep<Login, LoggedIn>(command);
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

export interface LoggedIn {
    subscriptions: Subscription[]
}

export class Login implements ICommand<LoggedIn>
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
export class LoginHandler implements HandleCommand<Login, LoggedIn>
{
    private readonly cli: AzureCLI;

    constructor(
        @inject(AzureCLI) cli: AzureCLI) {
        this.cli = cli;
    }

    execute(command: Login): LoggedIn {
        let rvalue = this.cli.execJson<LoggedIn>(`login --service-principal -t "${command.tenantId}" -u "${command.clientId}" -p "${command.clientSecret}"`);        
        return rvalue;
    }    
}