let terraformCommand: string = 'plan';
let expectedCommand: string = `${terraformCommand}`

export let env: any = {
    taskScenarioPath:           require.resolve('./plan-without-envservicename'),
    terraformCommand:           terraformCommand,
    expectedCommand:            expectedCommand
}