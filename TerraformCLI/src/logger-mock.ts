import { injectable } from "inversify";
import { TerraformCommand, ILogger } from "./terraform";
import { TelemetryClient } from "applicationinsights";

@injectable()
export default class LoggerMock implements ILogger {    
    private readonly tasks: any;
    private readonly telemetry: TelemetryClient;
    constructor(tasks: any, telemetry: TelemetryClient) {
        this.telemetry = telemetry;
        this.tasks = tasks;
    }

    command<TCommand extends TerraformCommand>(command: TCommand, handler: (command: TCommand) => Promise<number>, properties: any) : Promise<number>{
        return handler(command);
    }

    debug(message: string): void {
        this.tasks.debug(message);
    }

    error(message: string): void {
        this.tasks.error(message);
    }
}