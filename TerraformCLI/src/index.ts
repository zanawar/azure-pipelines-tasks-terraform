import tasks = require("azure-pipelines-task-lib/task");
import { Container, interfaces } from 'inversify';
import "reflect-metadata";
import { TerraformInterfaces, TerraformProvider, ITerraformProvider, ITaskAgent } from "./terraform";
import { TerraformInitHandler } from "./terraform-init";
import { TerraformVersionHandler } from "./terraform-version";
import { TerraformValidateHandler } from "./terraform-validate";
import { TerraformPlanHandler } from "./terraform-plan";
import { TerraformApplyHandler } from "./terraform-apply";
import TaskAgent from "./task-agent";
import { AzureCLI } from "./azcli/azure-cli";
import { AccountSet, AccountSetResult, SetAccountHandler } from "./azcli/commands/account-set";
import { LoginResult, Login, LoginHandler } from "./azcli/commands/login";
import { GroupCreate, GroupCreateResult, GroupCreateHandler } from "./azcli/commands/group-create";
import { StorageAccountCreate, StorageAccountCreateResult, StorageAccountCreateHandler } from "./azcli/commands/storage-account-create";
import { StorageAccountKeysList, StorageAccountKeysListResult, StorageAccountKeysListHandler } from "./azcli/commands/storage-account-keys-list";
import { StorageContainerCreate, StorageContainerCreateHandler, StorageContainerCreateResult } from "./azcli/commands/storage-container-create";
import { MediatorInterfaces, IMediator, Mediator } from "./mediator";
import { IHandleCommandString, CommandInterfaces, IHandleCommand } from "./commands";

var container = new Container();

// bind infrastructure components
container.bind<Container>("container").toConstantValue(container);
container.bind<ITerraformProvider>(TerraformInterfaces.ITerraformProvider).toDynamicValue((context: interfaces.Context) => new TerraformProvider(tasks));
container.bind<IMediator>(MediatorInterfaces.IMediator).to(Mediator);
container.bind<ITaskAgent>(TerraformInterfaces.ITaskAgent).to(TaskAgent);
container.bind<AzureCLI>(AzureCLI).toDynamicValue((context: interfaces.Context) => {
    return new AzureCLI(() => {
        let path = tasks.which("az", true);
        return tasks.tool(path);
    })
});

// bind handlers for each azure shell command
container.bind<IHandleCommand<Login, LoginResult>>(CommandInterfaces.IHandleCommand).to(LoginHandler).whenTargetNamed(Login.name);
container.bind<IHandleCommand<AccountSet, AccountSetResult>>(CommandInterfaces.IHandleCommand).to(SetAccountHandler).whenTargetNamed(AccountSet.name);
container.bind<IHandleCommand<GroupCreate, GroupCreateResult>>(CommandInterfaces.IHandleCommand).to(GroupCreateHandler).whenTargetNamed(GroupCreate.name);
container.bind<IHandleCommand<StorageAccountCreate, StorageAccountCreateResult>>(CommandInterfaces.IHandleCommand).to(StorageAccountCreateHandler).whenTargetNamed(StorageAccountCreate.name);
container.bind<IHandleCommand<StorageAccountKeysList, StorageAccountKeysListResult>>(CommandInterfaces.IHandleCommand).to(StorageAccountKeysListHandler).whenTargetNamed(StorageAccountKeysList.name);
container.bind<IHandleCommand<StorageContainerCreate, StorageContainerCreateResult>>(CommandInterfaces.IHandleCommand).to(StorageContainerCreateHandler).whenTargetNamed(StorageContainerCreate.name);

// bind the handlers for each terraform command
container.bind<IHandleCommandString>(CommandInterfaces.IHandleCommandString).to(TerraformInitHandler).whenTargetNamed("init");
container.bind<IHandleCommandString>(CommandInterfaces.IHandleCommandString).to(TerraformVersionHandler).whenTargetNamed("version");
container.bind<IHandleCommandString>(CommandInterfaces.IHandleCommandString).to(TerraformValidateHandler).whenTargetNamed("validate");
container.bind<IHandleCommandString>(CommandInterfaces.IHandleCommandString).to(TerraformPlanHandler).whenTargetNamed("plan");
container.bind<IHandleCommandString>(CommandInterfaces.IHandleCommandString).to(TerraformApplyHandler).whenTargetNamed("apply");

// execute the terraform command
let mediator = container.get<IMediator>(MediatorInterfaces.IMediator);
mediator.executeRawString("version")
    // what should be used when executed by az dev ops
    .then(() => mediator.executeRawString(tasks.getInput("command")))

    // for testing only
    // .then(() => mediator.execute("init"))
    // .then(() => mediator.execute("validate"))
    // .then(() => mediator.execute("plan"))
    // .then(() => mediator.execute("apply"))
    // end for testing only

    .then(() => {
        tasks.setResult(tasks.TaskResult.Succeeded, "");
    })
    .catch((error) => {
        tasks.setResult(tasks.TaskResult.Failed, error)
    });

