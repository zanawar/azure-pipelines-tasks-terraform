import * as tasks from 'azure-pipelines-task-lib/task';
import { ITaskAgent } from './terraform';

export default class TaskAgentMock implements ITaskAgent {
    constructor() {
        tasks.debug('Using mock task agent');
    }

    async downloadSecureFile(secureFileId: string) {
        tasks.debug('Executing downloadSecureFile mock with id = ' + secureFileId);
        let fileName: string = secureFileId + '.filename';
        let tempDownloadPath: string = '/build/temp/' + fileName;
        return tempDownloadPath;
    }
}