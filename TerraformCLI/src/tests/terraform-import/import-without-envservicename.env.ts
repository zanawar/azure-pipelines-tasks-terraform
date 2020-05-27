const terraformCommand: string = 'import';
const resourceAddress = "azurerm_resource_group.rg"
const resourceId = "/subscriptions/sub1/resourceGroups/rg-tffoo-dev-eastus"
const commandOptions = `${resourceAddress} ${resourceId}`
const expectedCommand = `${terraformCommand} ${commandOptions}`

export let env: any = {
    taskScenarioPath:           require.resolve('./import-azurerm'),
    terraformCommand:           terraformCommand,
    expectedCommand:            expectedCommand,
    commandOptions:             commandOptions,
    resourceAddress:            resourceAddress,
    resourceId:                 resourceId
}