import tasks = require("azure-pipelines-task-lib/task");
import { Container, interfaces } from 'inversify';
import "reflect-metadata";
import { IMediator, TYPES, Mediator, IHandleCommand, TerraformProvider, ITerraformProvider, ITaskAgent } from "./terraform";
import { TerraformInitHandler } from "./terraform-init";
import { TerraformVersionHandler } from "./terraform-version";
import { TerraformValidateHandler } from "./terraform-validate";
import { TerraformPlanHandler } from "./terraform-plan";
import { TerraformApplyHandler } from "./terraform-apply";
import TaskAgent from "./task-agent";

var container = new Container();

// bind infrastructure components
container.bind<Container>("container").toConstantValue(container);
container.bind<ITerraformProvider>(TYPES.ITerraformProvider).toDynamicValue((context: interfaces.Context) => new TerraformProvider(tasks));
container.bind<IMediator>(TYPES.IMediator).to(Mediator);
container.bind<ITaskAgent>(TYPES.ITaskAgent).to(TaskAgent);

// bind the handlers for each terraform command
container.bind<IHandleCommand>(TYPES.IHandleCommand).to(TerraformInitHandler).whenTargetNamed("init");
container.bind<IHandleCommand>(TYPES.IHandleCommand).to(TerraformVersionHandler).whenTargetNamed("version");
container.bind<IHandleCommand>(TYPES.IHandleCommand).to(TerraformValidateHandler).whenTargetNamed("validate");
container.bind<IHandleCommand>(TYPES.IHandleCommand).to(TerraformPlanHandler).whenTargetNamed("plan");
container.bind<IHandleCommand>(TYPES.IHandleCommand).to(TerraformApplyHandler).whenTargetNamed("apply");

// execute the terraform command
let mediator = container.get<IMediator>(TYPES.IMediator);
mediator.execute("version")
    // what should be used when executed by az dev ops
    .then(() => mediator.execute(tasks.getInput("command")))

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

