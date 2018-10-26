import tasks = require('vsts-task-lib/task');
import * as tools from 'vsts-task-tool-lib/tool';

async function verifyTerraform(){
    console.log("Verifying Terraform installation. Executing 'terraform version'");
    var terraformToolPath = tasks.which("terraform", true);
    var terraformTool = tasks.tool(terraformToolPath);
    terraformTool.arg("version");
    return terraformTool.exec()
}

verifyTerraform()
    .then(() => {
        tasks.setResult(tasks.TaskResult.Succeeded, "");
    })
    .catch((error) => {
        tasks.setResult(tasks.TaskResult.Failed, error)
    })