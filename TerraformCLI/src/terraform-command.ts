export class TerraformCommand{
    public readonly name: string;
    public readonly workingDirectory: string;
    constructor(name: string, workingDirectory: string) {        
        this.name = name;
        this.workingDirectory = workingDirectory;
    }
}