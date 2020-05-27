let terraformCommand: string = 'destroy';
let commandArgs: string = '-auto-approve'
let expectedCommand: string = `${terraformCommand} ${commandArgs}`

export let env: any = {
    taskScenarioPath:           require.resolve('./destroy-without-envservicename'),
    terraformCommand:           terraformCommand,
    commandArgs:                commandArgs,
    expectedCommand:            expectedCommand
}