export class TerraformCommand{
    public readonly name: string;
    public readonly workingDirectory: string;
    public readonly varsFile: string | null;
    public readonly connectedServiceNameARM: string | null;
    constructor(
        name: string, 
        workingDirectory: string,
        varsFile: string | null,
        connectedServiceNameARM: string | null) {        
        this.name = name;
        this.workingDirectory = workingDirectory;
        if(varsFile === workingDirectory){
            this.varsFile = null;
        }
        else{
            this.varsFile = varsFile;   
        }        
        this.connectedServiceNameARM = connectedServiceNameARM;
    }
}