const terraformCommand: string = 'show';
const inputFile: string = "show.tfstate"
const commandOptions: string = `-json ${inputFile}`;
const expectedCommand: string = `${terraformCommand} ${commandOptions}`
const stdout: string = '{"format_version":"0.112"}'
const secureVarsFileId: string = "bc813121-0bf2-4713-9949-bfb54023bd6c"
const secureVarsFileName: string = "./.bin/tests/terraform-show/default.env";

export let env: any = {
    taskScenarioPath: require.resolve('./show-with-tfstate-input-file'),
    terraformCommand:       terraformCommand,
    expectedCommand:        expectedCommand,
    inputFile:              inputFile,
    stdout:                 stdout,
    commandOptions:         commandOptions,
    secureVarsFileId,
    secureVarsFileName
}