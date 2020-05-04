Feature: terraform init

    terraform init [options] [dir]

    Scenario: init with null backend
        Given terraform exists
        And terraform command is "init"
        And running command "terraform init" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform init"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

    Scenario: init fails
        Given terraform exists
        And terraform command is "init"
        And running command "terraform init" fails with error "init failed"
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform init"
        And the terraform cli task fails with message "init failed"
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "1"

    Scenario: init with command options
        Given terraform exists
        And terraform command is "init" with options "-input=true -lock=false -no-color"
        And running command "terraform init -input=true -lock=false -no-color" returns successful result
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform init -input=true -lock=false -no-color"
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"

    Scenario: init with backend azurerm
        Given terraform exists
        And terraform command is "init"
        And azurerm service connection "backend" exists as
            | scheme         | ServicePrincipal       |
            | subscriptionId | sub1                   |
            | tenantId       | ten1                   |
            | clientId       | servicePrincipal1      |
            | clientSecret   | servicePrincipalKey123 |
        And azurerm backend type selected with the following storage account
            | resourceGroup | rg-backend-storage |
            | name          | storage            |
            | container     | container          |
            | key           | master             |
        And running command "terraform init" with the following options returns successful result
            | option                                                   |
            | -backend-config=storage_account_name=storage             |
            | -backend-config=container_name=container                 |
            | -backend-config=key=master                               |
            | -backend-config=resource_group_name=rg-backend-storage   |
            | -backend-config=arm_subscription_id=sub1                 |
            | -backend-config=arm_tenant_id=ten1                       |
            | -backend-config=arm_client_id=servicePrincipal1          |
            | -backend-config=arm_client_secret=servicePrincipalKey123 |
        When the terraform cli task is run
        Then the terraform cli task executed command "terraform init" with the following options
            | option                                                   |
            | -backend-config=storage_account_name=storage             |
            | -backend-config=container_name=container                 |
            | -backend-config=key=master                               |
            | -backend-config=resource_group_name=rg-backend-storage   |
            | -backend-config=arm_subscription_id=sub1                 |
            | -backend-config=arm_tenant_id=ten1                       |
            | -backend-config=arm_client_id=servicePrincipal1          |
            | -backend-config=arm_client_secret=servicePrincipalKey123 |
        And the terraform cli task is successful
        And pipeline variable "TERRAFORM_LAST_EXITCODE" is set to "0"