import { ToolRunner } from "azure-pipelines-task-lib/toolrunner";
import { injectable } from "inversify";

@injectable()
export class AzRunner {
    private readonly tasks: any;
    constructor(tasks: any) {
        this.tasks = tasks;
    }

    start(): ToolRunner {
        let path = this.tasks.which("az", true);
        return this.tasks.tool(path);
    }

    execJson<T>(line: string): T {
        let cli = this.start()

        cli.line(line);
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