import { ITaskAgent } from './terraform';
import { injectable } from 'inversify';
import path from 'path';

@injectable()
export default class TaskAgentMock implements ITaskAgent {
    constructor() {
    }

    async downloadSecureFile(secureFileId: string): Promise<string> {
        const secureFileEnv = `SECUREFILE_NAME_${secureFileId}`;        
        let filePath = process.env[secureFileEnv];

        if(!filePath){
            throw `Secure file ${secureFileId} not found. Did you add 'inputSecureFile' into your scenario pipeline?`
        }

        console.log("CZ SECURE FILE PATH IS: ", path.resolve(filePath));
        
        return Promise.resolve(filePath);
    }
}