import tasks = require("azure-pipelines-task-lib/task");
import { Container, interfaces } from 'inversify';
import "reflect-metadata";
import { TerraformInterfaces, ITaskAgent, ILogger } from "./terraform";
import { TerraformInitHandler } from "./terraform-init";
import { TerraformVersionHandler } from "./terraform-version";
import { TerraformValidateHandler } from "./terraform-validate";
import { TerraformPlanHandler } from "./terraform-plan";
import { TerraformApplyHandler } from "./terraform-apply";
import { TerraformDestroyHandler } from "./terraform-destroy";
import { TerraformShowHandler } from "./terraform-show";
import { TerraformRefreshHandler } from "./terraform-refresh";
import { TerraformImportHandler } from "./terraform-import";
import TaskAgent from "./task-agent";
import { AzRunner } from "./az-runner";
import { AzAccountSet, AzAccountSetResult, AzAccountSetHandler } from "./az-account-set";
import { AzLoginResult, AzLogin, AzLoginHandler } from "./az-login";
import { AzGroupCreate, AzGroupCreateResult, AzGroupCreateHandler } from "./az-group-create";
import { AzStorageAccountCreate, AzStorageAccountCreateResult, AzStorageAccountCreateHandler } from "./az-storage-account-create";
import { AzStorageAccountKeysList, AzStorageAccountKeysListResult, AzStorageAccountKeysListHandler } from "./az-storage-account-keys-list";
import { AzStorageContainerCreate, AzStorageContainerCreateHandler, AzStorageContainerCreateResult } from "./az-storage-container-create";
import { MediatorInterfaces, IMediator, Mediator } from "./mediator";
import { IHandleCommandString, CommandInterfaces, IHandleCommand } from "./command-handler";
import Logger from "./logger";

import ai = require('applicationinsights');
import { TelemetryClient } from "applicationinsights";
import { TerraformAggregateError } from "./terraform-aggregate-error";
import { TerraformOutputHandler } from "./terraform-output";


let allowTelemetryCollection =  tasks.getBoolInput("allowTelemetryCollection")
if(allowTelemetryCollection) {
    ai.setup(tasks.getInput("aiInstrumentationKey"))
        .setAutoCollectConsole(true, true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoDependencyCorrelation(true)
        .setInternalLogging(false)
        .start();

    ai.defaultClient.commonProperties = {
        'system.teamfoundationcollectionuri': tasks.getVariable("System.TeamFoundationCollectionUri"),
        'system.teamproject': tasks.getVariable("System.TeamProject"),
        'system.hosttype': tasks.getVariable("System.HostType"),
        'agent.os': tasks.getVariable("Agent.OS"),
        'agent.osarchitecture': tasks.getVariable("Agent.OSArchitecture"),
        'agent.jobstatus': tasks.getVariable("Agent.JobStatus")
    }  
}  

var container = new Container();

// bind infrastructure components
container.bind<Container>("container").toConstantValue(container);
container.bind<IMediator>(MediatorInterfaces.IMediator).to(Mediator);
container.bind<ITaskAgent>(TerraformInterfaces.ITaskAgent).to(TaskAgent);
container.bind<AzRunner>(AzRunner).toDynamicValue((context: interfaces.Context) => new AzRunner(tasks));
container.bind<ILogger>(TerraformInterfaces.ILogger).toDynamicValue((context: interfaces.Context) => new Logger(tasks, ai.defaultClient));
container.bind<TelemetryClient>(TelemetryClient).toConstantValue(ai.defaultClient);

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
container.bind<IHandleCommandString>(CommandInterfaces.IHandleCommandString).to(TerraformDestroyHandler).whenTargetNamed("destroy");
container.bind<IHandleCommandString>(CommandInterfaces.IHandleCommandString).to(TerraformShowHandler).whenTargetNamed("show");
container.bind<IHandleCommandString>(CommandInterfaces.IHandleCommandString).to(TerraformRefreshHandler).whenTargetNamed("refresh");
container.bind<IHandleCommandString>(CommandInterfaces.IHandleCommandString).to(TerraformImportHandler).whenTargetNamed("import");
container.bind<IHandleCommandString>(CommandInterfaces.IHandleCommandString).to(TerraformOutputHandler).whenTargetNamed("output");

// execute the terraform command
let mediator = container.get<IMediator>(MediatorInterfaces.IMediator);
let foo = process.env;
const lastExitCodeVariableName = "TERRAFORM_LAST_EXITCODE";
mediator.executeRawString("version")
    // what should be used when executed by az dev ops
    .then(() => mediator.executeRawString(tasks.getInput("command")))

    // for testing only
    // .then(() => mediator.execute("init"))
    // .then(() => mediator.execute("validate"))
    // .then(() => mediator.execute("plan"))
    // .then(() => mediator.execute("apply"))
    // end for testing only

    .then((exitCode) => {
        tasks.setVariable(lastExitCodeVariableName, exitCode.toString(), false);
        tasks.setResult(tasks.TaskResult.Succeeded, "");
        if(allowTelemetryCollection) {
            ai.defaultClient.flush();
        }
    })
    .catch((error) => {
        let exitCode: number = 1;
        if(error instanceof TerraformAggregateError)
            exitCode = (<TerraformAggregateError>error).exitCode || exitCode;
        tasks.setVariable(lastExitCodeVariableName, exitCode.toString(), false);
        tasks.setResult(tasks.TaskResult.Failed, error);
        if(allowTelemetryCollection) {
            ai.defaultClient.flush();
        }
    });

