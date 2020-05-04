import { RunnerOptionsDecorator, RunnerOptionsBuilder } from ".";
import { ITaskAgent } from "../../../terraform";
import { RunnerOptions } from "..";
import * as dotenv from "dotenv"
import path from 'path';

export default class RunWithSecureVarFile extends RunnerOptionsDecorator{    
    private readonly taskAgent: ITaskAgent;
    private readonly secureVarFileId: string | undefined;
    private readonly secureVarFileName: string | undefined;
    constructor(builder: RunnerOptionsBuilder, taskAgent: ITaskAgent, secureVarFileId?: string | undefined, secureVarFileName?: string | undefined) {
        super(builder);
        this.taskAgent = taskAgent;
        this.secureVarFileId = secureVarFileId;
        this.secureVarFileName = secureVarFileName;
    }
    async build(): Promise<RunnerOptions> {        
        const options = await this.builder.build();
        if(this.secureVarFileId && this.secureVarFileName){
            const secureFilePath = await this.taskAgent.downloadSecureFile(this.secureVarFileId);
            if(this.isEnvFile(this.secureVarFileName)) {
                let config = dotenv.config({ path: secureFilePath }).parsed;
                if ((!config) || (Object.keys(config).length === 0 && config.constructor === Object)) {
                    throw "The .env file doesn't have valid entries.";
                }
            } else {
                options.args.push(`-var-file=${secureFilePath}`);
            }
        }
        return options;
    }
    isEnvFile(fileName: string) {
        if (fileName === undefined || fileName === null) return false;
        if (fileName === '.env') return true;
        return ('.env' === path.extname(fileName))
    }
}

declare module "."{
    interface RunnerOptionsBuilder{
        withSecureVarFile(this: RunnerOptionsBuilder, taskAgent: ITaskAgent, secureVarFileId?: string | undefined, secureVarFileName?: string | undefined): RunnerOptionsBuilder;
    }
}

RunnerOptionsBuilder.prototype.withSecureVarFile = function(this: RunnerOptionsBuilder, taskAgent: ITaskAgent, secureVarFileId?: string | undefined, secureVarFileName?: string | undefined): RunnerOptionsBuilder {
    return new RunWithSecureVarFile(this, taskAgent, secureVarFileId, secureVarFileName);
}