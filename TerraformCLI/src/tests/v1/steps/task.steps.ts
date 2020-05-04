import { binding, given, then, when, after, before } from 'cucumber-tsflow';
import { expect } from 'chai';
import TaskRunner from './task-runner';
import { TaskAnswers } from './task-answers.steps';
import { requestedAnswers } from './mock-answer-spy';
import { TableDefinition } from 'cucumber';
import { MockTaskContext } from '../../../v1/context';
import { CommandStatus } from '../../../v1/commands';


@binding([TaskRunner, MockTaskContext, TaskAnswers])
export class TerraformSteps {
    constructor(
        private test: TaskRunner, 
        private ctx: MockTaskContext,
        private answers: TaskAnswers) { }        

    @when("the terraform cli task is run")
    public async terraformIsExecuted(){
        await this.test.run(this.ctx, this.answers);     
    }

    @then("the terraform cli task executed command {string}")
    public assertExecutedCommand(command: string){
        const executions = requestedAnswers['exec']
        if(executions){
            expect(executions.indexOf(command)).to.be.greaterThan(-1);
        }
    }

    @then("the terraform cli task executed command {string} with the following options")
    public assertExecutedCommandWithOptions(command: string, table: TableDefinition){
        const args = table.rows();
        command = `${command} ${args.join(' ')}`

        const executions = requestedAnswers['exec']
        if(executions){
            expect(executions.indexOf(command)).to.be.greaterThan(-1);
        }
    }

    @then("the terraform cli task executed command {string} with the following environment variables")
    public assertExecutedCommandWithEnvironmentVariables(command: string, table: TableDefinition){
        this.assertExecutedCommand(command);
        const expectedEnv = table.rowsHash();
        for(let key in expectedEnv){
            expect(process.env[key]).to.not.be.undefined
            expect(process.env[key]).to.eq(expectedEnv[key]);
        }
    }

    @then("the terraform cli task is successful")
    public terraformCliTaskIsSuccessful(){
        if(this.test.error){
            throw this.test.error;
        }
        else{
            expect(this.test.response).to.not.be.undefined;
            expect(this.test.error).to.be.undefined;
            if(this.test.response){
                expect(this.test.response.status).to.eq(CommandStatus.Success);
            }
        }        
    }

    @then("the terraform cli task fails with message {string}")
    public terraformCliTaskFailsWithMessage(message: string){
        if(this.test.error){
            throw this.test.error;
        }
        else{
            expect(this.test.response).to.not.be.undefined;
            expect(this.test.error).to.be.undefined;
            if(this.test.response){
                expect(this.test.response.status).to.eq(CommandStatus.Failed);
                expect(this.test.response.message).to.eq(message);
            }
        }        
    }

    @then("the terraform cli task throws error with message {string}")
    public theTerraformCliTaskThrowsError(message: string){
        expect(this.test.error).to.not.be.undefined;
        expect(this.test.response).to.be.undefined;
        if(this.test.error){
            expect(this.test.error.message).to.eq(message);
        }
    }
}