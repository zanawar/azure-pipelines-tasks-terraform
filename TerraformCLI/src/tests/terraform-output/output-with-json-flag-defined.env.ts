import { PipelineVariable } from "../scenarios";

const terraformCommand = 'output';
const commandOptions = "-json -no-color"
const expectedArgs = "-json -no-color"
const stdout = `{ 
	"some_string": {
    	"sensitive": false,
    	"type": "string",
    	"value": "some-string-value"
  	}
}`;

const pipelineVariables = <PipelineVariable[]>[{
	name: "TF_OUT_SOME_STRING",
	secret: false,
	value: "some-string-value"
}]

export let env: any = {
    taskScenarioPath: require.resolve('./output-with-json-flag-defined'),
    terraformCommand,
	commandOptions,
	expectedArgs,
	stdout,
	pipelineVariables
}
