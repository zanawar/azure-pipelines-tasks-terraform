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
import { IHandleCommand, CommandInterfaces, IHandleCommandResult } from "./commands";

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
container.bind<IHandleCommandResult<Login, LoginResult>>(CommandInterfaces.IHandleCommandResult).to(LoginHandler).whenTargetNamed(Login.name);
container.bind<IHandleCommandResult<AccountSet, AccountSetResult>>(CommandInterfaces.IHandleCommandResult).to(SetAccountHandler).whenTargetNamed(AccountSet.name);
container.bind<IHandleCommandResult<GroupCreate, GroupCreateResult>>(CommandInterfaces.IHandleCommandResult).to(GroupCreateHandler).whenTargetNamed(GroupCreate.name);
container.bind<IHandleCommandResult<StorageAccountCreate, StorageAccountCreateResult>>(CommandInterfaces.IHandleCommandResult).to(StorageAccountCreateHandler).whenTargetNamed(StorageAccountCreate.name);
container.bind<IHandleCommandResult<StorageAccountKeysList, StorageAccountKeysListResult>>(CommandInterfaces.IHandleCommandResult).to(StorageAccountKeysListHandler).whenTargetNamed(StorageAccountKeysList.name);
container.bind<IHandleCommandResult<StorageContainerCreate, StorageContainerCreateResult>>(CommandInterfaces.IHandleCommandResult).to(StorageContainerCreateHandler).whenTargetNamed(StorageContainerCreate.name);

// bind the handlers for each terraform command
container.bind<IHandleCommand>(CommandInterfaces.IHandleCommand).to(TerraformInitHandler).whenTargetNamed("init");
container.bind<IHandleCommand>(CommandInterfaces.IHandleCommand).to(TerraformVersionHandler).whenTargetNamed("version");
container.bind<IHandleCommand>(CommandInterfaces.IHandleCommand).to(TerraformValidateHandler).whenTargetNamed("validate");
container.bind<IHandleCommand>(CommandInterfaces.IHandleCommand).to(TerraformPlanHandler).whenTargetNamed("plan");
container.bind<IHandleCommand>(CommandInterfaces.IHandleCommand).to(TerraformApplyHandler).whenTargetNamed("apply");

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

