# Terraform for Azure Devops

[![Build status](https://dev.azure.com/chzipp/azure-pipelines-tasks-terraform/_apis/build/status/azure-pipelines-tasks-terraform)](https://dev.azure.com/chzipp/azure-pipelines-tasks-terraform/_build/latest?definitionId=2)

This contains the Azure Devops Pipeline tasks for installing and executing terraform commands within a build or release. These tasks are intended to work on any build agent. They are also intended to provide a guided abstraction to deploying infrastructure within Azure.

This repo provides two tasks
- [Terraform Installer](TerraformInstaller#readme) - Responsible for installing terraform on a build agent
- [Terraform CLI](TerraformCLI#readme) - Responsible for executing the terraform cli commands.

See readme for each of the tasks for development setup for each.

## Release Notes

### 0.4.4

#### Fixed issue that occured for existing azure storage accounts of kind "StorageV2"

Fixed issue where errors where occurring for storage accounts that were not of kind "BlobStorage". The underlying azure cli storage account create command was being executed regardless of the storage account's existance. If the storage account existed prior to executing the command, the command would attempt to set the storage account to kind "BlobStorage" access tier "hot" and configured sku. This would result in an error when updating storage account to this configuration was not supported. Example would be updating existing storage accounts that are kind "StorageV2" to "BlobStorage". This update is not permitted.

With this change, no attempt will be made to update existing storage accounts.

### 0.4.3

#### Fix command options sequence error

Fixed issue where automatically injected `apply` command options `-auto-approve` and `-var-file` were being placed after output plan file path. Output file plan path was being provided in the Commmand Options input field. The auto injected options would be appended after the user provided options. The auto injected options will now be inserted ahead of user provided options. This will allow users to provide a plan path at the end of their provided options to ensure all options are ordered as terraform expects.

### 0.4.1

#### Fix VSIX Validation Error

Fixed validation error reported during marketplace upload documented with issue #35.

### 0.4.0

#### Automated azurerm backend creation

#19 Create/Ensure AzureRM Backend Storage Account

The task supports automatically creating the resource group, storage account, and container for remote azurerm backend. To enable this, select the task for the terraform init command. Check the checkbox labled "Create Backend (If not exists)" underneath the backend type drop down. Once selected, the resource group location and storage account sku can be provided. The defaults are 'eastus' and 'Standard_RAGRS' respectively. The task will utilize AzureCLI to create the resource group, storage account, and container as specified in the backend configuration.

### 0.3.4

#### Doc Updates

- #22 Updated the overview docs to include references to destroy command support
- #32 Updated the default version of the installer to be the latest version of terraform

### 0.3.3

#### Destroy Command Support

- Added support for terraform destroy command #22 and PR #31
- Updated readme and sample env #23 and PR #24

### 0.3.1

#### Bug Fixes
Duplicated working directory input parameter was removed [#17](https://github.com/charleszipp/azure-pipelines-tasks-terraform/issues/17)

### 0.3.0

#### TerraformCLI: Secure Secrets
The task now supports the ability to upload and use a variable file that contains secrets. This stores the files using the [Secure Files](https://docs.microsoft.com/en-us/azure/devops/pipelines/library/secure-files?view=vsts) feature in Azure DevOps. The files are downloaded to a temporary location on the build agent while running a build or release. The file is removed from the agent after the build or release completes.

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


