import { PipelineVariable } from "../scenarios";

const terraformCommand = 'output';
const args = "-json"
const stdout = `{ 
	"some_bool": {
    	"sensitive": false,
    	"type": "bool",
    	"value": true
	},	  
	"some_string": {
    	"sensitive": false,
    	"type": "string",
    	"value": "some-string-value"
  	},	  
	"some_secret_string": {
		"sensitive": true,
		"type": "string",
		"value": "some-string-value"
	},	  
	"some_number": {
		"sensitive": false,
		"type": "number",
		"value": 1
	},
	"some_tuple": {
		"sensitive": false,
		"type": [ "tuple", [ "string", "number", "string" ]],
		"value": [ "1", 2, "3" ]
	},
	"some_map": {
	  "sensitive": false,
	  "type": [ "object", { "A": "number", "B": "number", "C": "number" }],
	  "value": {
		"A": 1,
		"B": 2,
		"C": 3
	  }
	}
}`;

const pipelineVariables = <PipelineVariable[]>[{
	name: "TF_OUT_SOME_BOOL",
	secret: false,
	value: "true"
},{
	name: "TF_OUT_SOME_STRING",
	secret: false,
	value: "some-string-value"
},{
	name: "TF_OUT_SOME_SECRET_STRING",
	secret: true,
	value: "some-string-value"
},{
	name: "TF_OUT_SOME_NUMBER",
	secret: false,
	value: "1"
}]

export let env: any = {
    taskScenarioPath: require.resolve('./output-with-output-vars-defined'),
    terraformCommand,
    args,
	stdout,
	pipelineVariables
}
