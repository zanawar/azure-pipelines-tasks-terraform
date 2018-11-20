const terraformCommand: string = "init";
const commandOptions:string = "-input=true -lock=false -no-color"
const expectedCommand: string = `${terraformCommand} ${commandOptions}`

export let env: any = {
    taskScenarioPath:       require.resolve('./init-with-options'),
    terraformCommand:       terraformCommand,
    commandOptions:         commandOptions,
    expectedCommand:        expectedCommand
}