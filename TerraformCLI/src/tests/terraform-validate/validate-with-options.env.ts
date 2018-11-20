const terraformCommand: string = "validate";
const commandOptions:string = "-input=true -lock=false -no-color"
const expectedCommand: string = `${terraformCommand} ${commandOptions}`

export let env: any = {
    taskScenarioPath:       require.resolve('./validate-with-options'),
    terraformCommand:       terraformCommand,
    commandOptions:         commandOptions,
    expectedCommand:        expectedCommand
}