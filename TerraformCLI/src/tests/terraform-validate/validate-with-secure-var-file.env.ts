const terraformCommand: string = "validate";
let secureVarsFile: string = "foo.vars";
const expectedCommand: string = `${terraformCommand} -var-file=${secureVarsFile}`

export let env: any = {
    taskScenarioPath:       require.resolve('./validate-with-secure-var-file'),
    terraformCommand:       terraformCommand,
    secureVarsFile:         secureVarsFile,
    expectedCommand:        expectedCommand
}