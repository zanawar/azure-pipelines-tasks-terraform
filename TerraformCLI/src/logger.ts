import { injectable } from "inversify";

@injectable()
export class Logger {
    private readonly tasks: any;
    constructor(tasks: any) {
        this.tasks = tasks;
    }

    debug(message: string): void {
        this.tasks.debug(message);
    }

    command(command: string, properties: any, message: string): void{
        this.tasks.command(command, properties, message)
    }

    error(message: string): void {
        this.tasks.error(message);
    }
}