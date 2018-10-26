export class TerraformCommand{
    public readonly name: string;
    public readonly workingDirectory: string;
    public readonly varsFile: string;
    constructor(
        name: string, 
        workingDirectory: string,
        varsFile: string) {        
        this.name = name;
        this.workingDirectory = workingDirectory;
        this.varsFile = varsFile;
    }
}