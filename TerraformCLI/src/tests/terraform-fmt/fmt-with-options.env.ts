const terraformCommand: string = "fmt";
const commandOptions:string = "--diff --nocolor"
const expectedCommand: string = `${terraformCommand} ${commandOptions}`

export let env: any = {
    taskScenarioPath:       require.resolve('./fmt-with-options'),
    terraformCommand:       terraformCommand,
    commandOptions:         commandOptions,
    expectedCommand:        expectedCommand
}
