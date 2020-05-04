import { RunnerOptions } from "..";

export abstract class RunnerOptionsBuilder {
    abstract build(): Promise<RunnerOptions>;
}

export abstract class RunnerOptionsDecorator extends RunnerOptionsBuilder{   
    constructor(protected readonly builder: RunnerOptionsBuilder){        
        super();
    }
}

export { default as RunWithSecureVarFile } from './run-with-secure-var-file';
export { default as RunWithAutoApprove } from './run-with-auto-approve';
export { default as RunWithBackend } from './run-with-backend';
export { default as RunWithTerraform } from "./run-with-terraform";
export { default as RunWithAzCli } from "./run-with-azcli";

