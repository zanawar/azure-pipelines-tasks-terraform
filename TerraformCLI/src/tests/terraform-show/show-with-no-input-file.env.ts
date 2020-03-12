const terraformCommand: string = 'show';
const inputFile = undefined
const commandOptions: string = `-json`;
const expectedCommand: string = `${terraformCommand} ${commandOptions}`
const stdout: string = '{"format_version":"0.112"}'

export let env: any = {
    taskScenarioPath: require.resolve('./show-with-no-input-file'),
    terraformCommand:       terraformCommand,
    expectedCommand:        expectedCommand,
    inputFile:              inputFile,
    stdout:                 stdout,
    commandOptions:         commandOptions
}
