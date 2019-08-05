import { injectable } from "inversify";
import { TerraformCommand, ILogger } from "./terraform";
import { RequestTelemetry, ExceptionTelemetry } from "applicationinsights/out/Declarations/Contracts";
import { TelemetryClient } from "applicationinsights";
import { TerraformAggregateError } from "./terraform-aggregate-error";

@injectable()
export default class Logger implements ILogger {
    private readonly tasks: any;
    private readonly telemetry: TelemetryClient;
    constructor(tasks: any, telemetry: TelemetryClient) {
        this.telemetry = telemetry;
        this.tasks = tasks;
    }

    async command<TCommand extends TerraformCommand>(command: TCommand, handler: (command: TCommand) => Promise<number>, properties: any) : Promise<number>{
        let start: [number, number] = process.hrtime();
        let request: RequestTelemetry = <RequestTelemetry>{
            name: command.name,
            properties: properties,
        }
        try{
            let rvalue: number = await handler(command);
            request.resultCode = 200;
            request.success = true;
            return rvalue;
        }
        catch(e) {            
            request.resultCode = 500;
            request.success = false;
            if(e instanceof TerraformAggregateError){
                (<TerraformAggregateError>e).errors
                    .map(error => <ExceptionTelemetry>{ exception: error })
                    .forEach(exception => this.telemetry.trackException(exception));                
            }
            else{
                this.telemetry.trackException(<ExceptionTelemetry>{ exception: e });
            }
            
            throw e;
        }
        finally{
            let end: [number, number] = process.hrtime(start);
            request.duration = end[1] / 1000000;
            this.telemetry.trackRequest(request);
        }        
    }

    debug(message: string): void {
        this.tasks.debug(message);
    }

    error(message: string): void {
        this.tasks.error(message);
    }
}