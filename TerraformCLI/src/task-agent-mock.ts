import { ITaskAgent } from './terraform';
import { injectable } from 'inversify';
import path from 'path';

@injectable()
export default class TaskAgentMock implements ITaskAgent {
    constructor() {
    }

    async downloadSecureFile(secureFileId: string): Promise<string> {
        const secureFileEnv = `SECUREFILE_NAME_${secureFileId}`;
        let filePath: string = "";
        filePath = process.env[secureFileEnv] || filePath;
        const agentTempDir = process.env["AGENT_TEMPDIRECTORY"];
        if(agentTempDir && filePath){
            filePath = path.join(agentTempDir, filePath);
        }
        
        return Promise.resolve(filePath);
    }
}