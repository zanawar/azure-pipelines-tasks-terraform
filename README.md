# Terraform for Azure Devops

This contains the Azure Devops Pipeline tasks for executing terraform commands within a build or release. These tasks are intended to work on any build agent. They are also intended to provide a guided abstraction to deploying infrastructure within Azure.

## Dev Environment Operations

### Visual Studio Code Debugging Support
There is a configuration for each task provided. The each configuration will allow setting break points and debugging the execution of the task
- TerraformInstaller: NPM DEBUG
- TerraformCLI: NPM DEBUG

### Restore the npm packages for each task 
```
cd TerraformCLI
npm install
```

### Run the task locally
This will load the necessary environment variables from the `.env` file for the task and then execute the task.
```
npm run test
```

### Build task
```
npm run build
```

### Upload to Azure Devops
This task requires authorizing the tfx cli with the target azure devops instance. See [TFS-CLI Docs](https://github.com/Microsoft/tfs-cli).
```
npm run upload
```

