let terraformCommand: string = 'refresh';
let expectedCommand: string = `${terraformCommand}`

export let env: any = {
    taskScenarioPath:           require.resolve('./refresh-without-envservicename'),
    terraformCommand:           terraformCommand,
    expectedCommand:            expectedCommand
}