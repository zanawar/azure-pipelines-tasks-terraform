const terraformCommand = 'output';
const args = "-json"
const stdout: string = "";

export let env: any = {
    taskScenarioPath: require.resolve('./output-with-no-output-vars-defined'),
    terraformCommand,
    args,
	stdout
}
