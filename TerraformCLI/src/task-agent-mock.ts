import { ITaskAgent } from './terraform';
import { injectable } from 'inversify';

@injectable()
export default class TaskAgentMock implements ITaskAgent {
    constructor() {
    }

    async downloadSecureFile(secureFileId: string) {
        return secureFileId;
    }
}