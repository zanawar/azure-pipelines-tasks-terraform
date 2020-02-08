const terraformCommand: string = "validate";
const secureVarsFileId: string = "bc813121-0bf2-4713-9949-bfb54023bd6c"
const secureVarsFileName: string = "./.bin/tests/terraform-validate/default.vars";
const commandOptions: string = `-var-file=${secureVarsFileName}`;
const expectedCommand: string = `${terraformCommand} ${commandOptions}`

export let env: any = {
    taskScenarioPath: require.resolve('./validate-with-secure-var-file'),
    commandOptions,
    terraformCommand,
    secureVarsFileId,
    secureVarsFileName,
    expectedCommand
}