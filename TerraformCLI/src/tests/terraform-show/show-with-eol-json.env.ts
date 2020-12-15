const terraformCommand: string = 'show';
const inputFile: string = "show.plan"
const commandOptions: string = `-json ${inputFile}`;
const expectedCommand: string = `${terraformCommand} ${commandOptions}`
const stdout: string = '{"resource_changes": [{"address": "azurerm_resource_group.rg","mode": "managed","type": "azurerm_resource_group","name": "rg","provider_name": "azurerm","change": {"actions": [ "delete" ],"before": null,"after": {"location": "","name": "rg---"},"after_unknown": {"id": true,"tags": true}}}]}\n'

export let env: any = {
    taskScenarioPath: require.resolve('./show-with-eol-json'),
    terraformCommand:       terraformCommand,
    expectedCommand:        expectedCommand,
    inputFile:              inputFile,
    stdout:                 stdout,
    commandOptions:         commandOptions
}
