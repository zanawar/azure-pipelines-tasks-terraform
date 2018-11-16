import { TaskInputDecorator, TaskInputBuilder } from "./task-input-builder";
import { TaskScenario } from './task-scenario-builder';

declare module "./task-scenario-builder"{
    interface TaskScenario<TInputs>{
        withInputs(this: TaskScenario<TInputs>, inputs: Partial<TInputs>): TaskScenario<TInputs>
    }
}

export class TaskInputsAre<TInputs> extends TaskInputDecorator<TInputs>{
    private readonly partialInputs: any;
    constructor(builder: TaskInputBuilder<TInputs>, partialInputs: Partial<TInputs>) {
        super(builder);
        this.partialInputs = partialInputs;
    }
    build(): TInputs {
        let inputs: any = this.inputs.build();
        inputs = { ...inputs, ...this.partialInputs };        
        return inputs;
    }
}

function withInputs<TInputs>(this: TaskScenario<TInputs>, inputs: Partial<TInputs>): TaskScenario<TInputs>{
    this.withInputDecorator((builder) => new TaskInputsAre(builder, inputs));
    return this;
}

TaskScenario.prototype.withInputs = withInputs

