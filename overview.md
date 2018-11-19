# Terraform Tasks for Azure DevOps

The tasks in this extension allow for running terraform cli commands from both the Build and Release pipelines in Azure DevOps. The motivation for this extension was to provide terraform pipeline tasks that could execute on all build agent operating systems and provide contextual/guided task configuration.

## Compatible with Linux Build Agents

The tasks can execute on all supported build agent operating systems **including Ubuntu and MacOS**.

## Separate Task for Terraform Installation

The dedicated `Terraform Installer` task allows for complete control over how frequently and on which agents terraform is installed. This prevents from having to install terraform before executing each terraform task. However, if necessary, this can be installed multiple times to support pipelines that span multiple build agents

![Terraform Installer Task Definition](https://raw.githubusercontent.com/charleszipp/azure-pipelines-tasks-terraform/master/screenshots/overview-tfinstall-task-fields.jpg)

## Supported Commands
The Terraform CLI task supports executing the following commands
- version
- init
- validate
- plan
- apply

## Contextual Task Configuration
The task definition will adjust to the selected command to prompt for what is relevant to the command. For example, `validate` does not require knowledge of the backend configuration so this section will not be used when executing `validate`. The `validate` command does accept vars file however. Therefore, the field to specify vars file will be available.

## Azure Service Connection / Service Principal Integration
When executing `plan` or `apply` commands, the task will prompt for the target azure subscription to use. This is specified as a service connection/principal for deploying azure resources.

![Terraform Azure Environment Subscription](https://raw.githubusercontent.com/charleszipp/azure-pipelines-tasks-terraform/master/screenshots/overview-tfcli-azure-sub.jpg)

## Remote & Local Backend State Support
The task currently supports two backend configurations
- local (default for terraform) - State is stored on the agent file system.
- azurerm - State is stored in a blob container within a specified Azure Storage Account.

The backend configuration will be prompted when relevant for the selected command. If azurerm selected, the task will prompt for a service connection and storage account details to use for the backend.

![Terraform AzureRM Backend Configuration](https://raw.githubusercontent.com/charleszipp/azure-pipelines-tasks-terraform/master/screenshots/overview-tfcli-backend-azurerm.jpg)