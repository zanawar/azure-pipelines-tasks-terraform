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
import { AzAccountSet, AzAccountSetResult, AzAccountSetHandler } from "./azcli/commands/az-account-set";
import { AzLoginResult, AzLogin, AzLoginHandler } from "./azcli/commands/az-login";
import { AzGroupCreate, AzGroupCreateResult, AzGroupCreateHandler } from "./azcli/commands/az-group-create";
import { AzStorageAccountCreate, AzStorageAccountCreateResult, AzStorageAccountCreateHandler } from "./azcli/commands/az-storage-account-create";
import { AzStorageAccountKeysList, AzStorageAccountKeysListResult, AzStorageAccountKeysListHandler } from "./azcli/commands/az-storage-account-keys-list";
import { AzStorageContainerCreate, AzStorageContainerCreateHandler, AzStorageContainerCreateResult } from "./azcli/commands/az-storage-container-create";
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
container.bind<IHandleCommand<AzLogin, AzLoginResult>>(CommandInterfaces.IHandleCommand).to(AzLoginHandler).whenTargetNamed(AzLogin.name);
container.bind<IHandleCommand<AzAccountSet, AzAccountSetResult>>(CommandInterfaces.IHandleCommand).to(AzAccountSetHandler).whenTargetNamed(AzAccountSet.name);
container.bind<IHandleCommand<AzGroupCreate, AzGroupCreateResult>>(CommandInterfaces.IHandleCommand).to(AzGroupCreateHandler).whenTargetNamed(AzGroupCreate.name);
container.bind<IHandleCommand<AzStorageAccountCreate, AzStorageAccountCreateResult>>(CommandInterfaces.IHandleCommand).to(AzStorageAccountCreateHandler).whenTargetNamed(AzStorageAccountCreate.name);
container.bind<IHandleCommand<AzStorageAccountKeysList, AzStorageAccountKeysListResult>>(CommandInterfaces.IHandleCommand).to(AzStorageAccountKeysListHandler).whenTargetNamed(AzStorageAccountKeysList.name);
container.bind<IHandleCommand<AzStorageContainerCreate, AzStorageContainerCreateResult>>(CommandInterfaces.IHandleCommand).to(AzStorageContainerCreateHandler).whenTargetNamed(AzStorageContainerCreate.name);

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

