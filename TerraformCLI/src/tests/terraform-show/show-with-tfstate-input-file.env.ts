const terraformCommand: string = 'show';
const inputFile: string = "show.tfstate"
const commandOptions: string = `-json ${inputFile}`;
const expectedCommand: string = `${terraformCommand} ${commandOptions}`
const stdout: string = '{"format_version":"0.112"}'

export let env: any = {
    taskScenarioPath: require.resolve('./show-with-tfstate-input-file'),
    terraformCommand:       terraformCommand,
    expectedCommand:        expectedCommand,
    inputFile:              inputFile,
    stdout:                 stdout,
    commandOptions:         commandOptions
}
