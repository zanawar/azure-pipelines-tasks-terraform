# Terraform for Azure Devops

This contains the Azure Devops Pipeline tasks for installing and executing terraform commands within a build or release. These tasks are intended to work on any build agent. They are also intended to provide a guided abstraction to deploying infrastructure within Azure.

This repo provides two tasks
- [Terraform Installer](TerraformInstaller/README.md) - Responsible for installing terraform on a build agent
- [Terraform CLI](TerraformCLI/README.md) - Responsible for executing the terraform cli commands.

See readme for each of the tasks for development setup for each.

## Release Notes
