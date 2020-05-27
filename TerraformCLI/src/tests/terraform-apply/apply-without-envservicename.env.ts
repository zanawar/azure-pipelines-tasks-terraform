let terraformCommand: string = 'apply';
let commandArgs: string = '-auto-approve'
let expectedCommand: string = `${terraformCommand} ${commandArgs}`

export let env: any = {
    taskScenarioPath:           require.resolve('./apply-without-envservicename'),
    terraformCommand:           terraformCommand,
    commandArgs:                commandArgs,
    expectedCommand:            expectedCommand
}