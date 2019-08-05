import { TerraformError } from "./terraform-error";
export class TerraformAggregateError extends Error {
    public readonly errors: TerraformError[];
    constructor(command: string, stderr: string, exitCode: number) {
        let lines: string[] = stderr
            .replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
            .split('\n\n')
            .map(line => line.replace('\nError:', 'Error:'))
            .map(line => line.replace('\n', ' '))
            .filter(line => line && line !== "");
        let message: string = lines
            .filter(line => line.startsWith('Error:'))
            .map(line => line.replace('Error:', ''))
            .join(" | ");
        super(message);
        this.name = `Terraform command '${command}' failed with exit code '${exitCode}.`;
        this.errors = [];
        lines.forEach((line, i) => {
            if (line.startsWith('Error:')) {
                let name: string = line.replace('Error: ', '');
                let message: string = lines[(i + 1)];
                this.errors.push(new TerraformError(name, message));
            }
        });
        console.log('Error lines: ', this.errors);
    }
}
