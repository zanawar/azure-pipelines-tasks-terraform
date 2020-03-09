# Terraform for Azure Devops

[![Build status](https://dev.azure.com/chzipp/azure-pipelines-tasks-terraform/_apis/build/status/azure-pipelines-tasks-terraform)](https://dev.azure.com/chzipp/azure-pipelines-tasks-terraform/_build/latest?definitionId=2)
![Visual Studio Marketplace Installs - Azure DevOps Extension](https://img.shields.io/visual-studio-marketplace/azure-devops/installs/total/charleszipp.azure-pipelines-tasks-terraform?label=marketplace%20installs)

This contains the Azure Devops Pipeline tasks for installing and executing terraform commands within a build or release. These tasks are intended to work on any build agent. They are also intended to provide a guided abstraction to deploying infrastructure within Azure.

This repo provides two tasks
- [Terraform Installer](TerraformInstaller#readme) - Responsible for installing terraform on a build agent
- [Terraform CLI](TerraformCLI#readme) - Responsible for executing the terraform cli commands.

See readme for each of the tasks for development setup for each.