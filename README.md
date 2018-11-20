# Terraform for Azure Devops

[![Build status](https://dev.azure.com/chzipp/azure-pipelines-tasks-terraform/_apis/build/status/azure-pipelines-tasks-terraform)](https://dev.azure.com/chzipp/azure-pipelines-tasks-terraform/_build/latest?definitionId=2)

This contains the Azure Devops Pipeline tasks for installing and executing terraform commands within a build or release. These tasks are intended to work on any build agent. They are also intended to provide a guided abstraction to deploying infrastructure within Azure.

This repo provides two tasks
- [Terraform Installer](TerraformInstaller#readme) - Responsible for installing terraform on a build agent
- [Terraform CLI](TerraformCLI#readme) - Responsible for executing the terraform cli commands.

See readme for each of the tasks for development setup for each.

## Release Notes

### 0.2.2

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
