# Terraform for Azure Devops

[![Build status](https://dev.azure.com/chzipp/azure-pipelines-tasks-terraform/_apis/build/status/azure-pipelines-tasks-terraform)](https://dev.azure.com/chzipp/azure-pipelines-tasks-terraform/_build/latest?definitionId=2)

This contains the Azure Devops Pipeline tasks for installing and executing terraform commands within a build or release. These tasks are intended to work on any build agent. They are also intended to provide a guided abstraction to deploying infrastructure within Azure.

This repo provides two tasks
- [Terraform Installer](TerraformInstaller#readme) - Responsible for installing terraform on a build agent
- [Terraform CLI](TerraformCLI#readme) - Responsible for executing the terraform cli commands.

See readme for each of the tasks for development setup for each.

## Release Notes
### 0.3.1

#### Bug Fixes
Duplicated working directory input parameter was removed (#17)[https://github.com/charleszipp/azure-pipelines-tasks-terraform/issues/17]

### 0.3.0

#### TerraformCLI: Secure Secrets
The task now supports the ability to upload and use a variable file that contains secrets. This stores the files using the (Secure Files)[https://docs.microsoft.com/en-us/azure/devops/pipelines/library/secure-files?view=vsts] feature in Azure DevOps. The files are downloaded to a temporary location on the build agent while running a build or release. The file is removed from the agent after the build or release completes.

### 0.2.7

#### TerraformCLI: Support Arbitrary Command Options 
A new input has been added `Command Options` that will allow for defining command options that do not otherwise have dedicated inputs. For example, the following value could be provided in the command options field when running `validate`
```
-input=true -lock=false -no-color
```
This would result in the task executing `validate` as follows
```
terraform validate -input=true -lock=false -no-color
```
Command options will always preceed any other options that are generated via dedicated input such as backend config and/or variable file. 

### 0.2.6

#### Fixed `Error: Cannot find module` Error When Executing Installer and CLI Tasks
This error was due to a packaging issue with the vsix that was introduced with the changes to shrink the vsix. The changes for the shrink has been reworked to ensure runtime dependencies are included with the vsix package.

#### Marketplace Extension Shrink
Implemented new scripts for selecting only files required for task execution to be included in vsix. See [#8 VSIX Size Too Large for Marketplace Upload](https://github.com/charleszipp/azure-pipelines-tasks-terraform/pull/9)


