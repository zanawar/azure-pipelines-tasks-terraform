import { injectable } from "inversify";
import { TerraformCommand, ILogger } from "./terraform";
import { RequestTelemetry, ExceptionTelemetry } from "applicationinsights/out/Declarations/Contracts";
import { TelemetryClient } from "applicationinsights";
import { TerraformAggregateError } from "./terraform-aggregate-error";
import tasks = require("azure-pipelines-task-lib/task");

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
        let allowTelemetryCollection = tasks.getBoolInput("allowTelemetryCollection")
        
        let loggedOptions: any = {};
        if(command.options){
            let commandOptions = command.options.split(' ');            
            commandOptions.forEach(commandOption => {
                if(commandOption.startsWith('-')){       
                    let loggedOption = "command-option" + commandOption;
                    if(loggedOption.includes('=')){
                        loggedOption = loggedOption.substr(0, (loggedOption.indexOf('=')));            
                    }
                    loggedOptions[loggedOption] = (loggedOptions[loggedOption] || 0) + 1;
                }    
            });
        }

        let request: RequestTelemetry = <RequestTelemetry>{
            name: command.name,
            properties: { ...loggedOptions, ...properties }
        };

        try{
            let rvalue: number = await handler(command);
            request.resultCode = 200;
            request.success = true;
            return rvalue;
        }
        catch(e) {      
            if (allowTelemetryCollection) {
                request.resultCode = 500;
                request.success = false;
                if(e instanceof TerraformAggregateError){
                    let aggregateErrors = (<TerraformAggregateError>e);
                    let errorProperties = {
                        "stderr": aggregateErrors.stderr,
                        "aggregated-errors" : JSON.stringify(aggregateErrors.errors)
                    }
                    this.telemetry.trackException(<ExceptionTelemetry>{
                        exception: e,
                        properties : {
                            ...loggedOptions, ...properties, ...errorProperties
                        }
                    });
                    aggregateErrors.errors
                        .map(error => <ExceptionTelemetry>{ 
                            exception: error,
                            properties : {
                                ...loggedOptions, ...properties, ...errorProperties
                            } 
                        })
                        .forEach(exception => this.telemetry.trackException(exception));                
                }
                else{
                    this.telemetry.trackException(<ExceptionTelemetry>{ 
                        exception: e,
                        properties : {
                            ...loggedOptions, ...properties
                        } 
                    });
                }
            }
            
            throw e;
        }
        finally{
            if(allowTelemetryCollection) {
                let end: [number, number] = process.hrtime(start);
                request.duration = end[1] / 1000000;
                this.telemetry.trackRequest(request);
            }
        }        
    }

    debug(message: string): void {
        this.tasks.debug(message);
    }

    error(message: string): void {
        this.tasks.error(message);
    }
}