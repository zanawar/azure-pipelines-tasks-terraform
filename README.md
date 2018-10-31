# Terraform for Azure Devops

This contains the Azure Devops Pipeline tasks for executing terraform commands within a build or release. These tasks are intended to work on any build agent. They are also intended to provide a guided abstraction to deploying infrastructure within Azure.

## Dev Environment Operations

### Visual Studio Code Debugging Support
There is a configuration for each task provided. The each configuration will allow setting break points and debugging the execution of the task. The following launch configurations have been provided for debugging
- debug:tf installer    - Debug the TerraformInstaller task itself using the .env file as the input params
- debug:tf cli          - Debug the TerraformCLI task itself using the .env file as the input params
- debug:tf cli:tests    - Debug the unit tests
- debug:tf cli:e2e      - Debug the end to end tests

### Restore the npm packages for each task 
```
cd TerraformCLI
npm install
```

### Run the unit tests without debugging
```
npm test
```

### Build the task
```
npm run build
```

### Upload to Azure Devops
This task requires authorizing the tfx cli with the target azure devops instance. See [TFS-CLI Docs](https://github.com/Microsoft/tfs-cli).
```
npm run upload
```

