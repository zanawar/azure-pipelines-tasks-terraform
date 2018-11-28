# Terraform for Azure Devops

[![Build status](https://dev.azure.com/chzipp/azure-pipelines-tasks-terraform/_apis/build/status/azure-pipelines-tasks-terraform)](https://dev.azure.com/chzipp/azure-pipelines-tasks-terraform/_build/latest?definitionId=2)

This contains the Azure Devops Pipeline tasks for installing and executing terraform commands within a build or release. These tasks are intended to work on any build agent. They are also intended to provide a guided abstraction to deploying infrastructure within Azure.

This repo provides two tasks
- [Terraform Installer](TerraformInstaller#readme) - Responsible for installing terraform on a build agent
- [Terraform CLI](TerraformCLI#readme) - Responsible for executing the terraform cli commands.

See readme for each of the tasks for development setup for each.

## Release Notes

### 0.2.5

#### Marketplace Extension Shrink
Implemented new scripts for selecting only files required for task execution to be included in vsix. See [#8 VSIX Size Too Large for Marketplace Upload](https://github.com/charleszipp/azure-pipelines-tasks-terraform/pull/9)


