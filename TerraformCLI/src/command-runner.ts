import { ToolRunner } from "azure-pipelines-task-lib/toolrunner";
import { injectable } from "inversify";

@injectable()
export class CommandRunner {
    private readonly start: () => ToolRunner;
    constructor(start: () => ToolRunner) {
        this.start = start;
    }

    execJson<T>(line: string): T {        
        let cli = this.start()

        cli.line(`${line} -o json`);        
        let result = cli.execSync();
        let rvalue: T = <T>JSON.parse(result.stdout);
        return rvalue;
    }

    exec(line: string): void {    
        let cli = this.start()
        cli.line(line);
        cli.execSync();
    }
}