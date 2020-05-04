import { binding, given, after } from 'cucumber-tsflow';
import { TableDefinition } from 'cucumber'
import { TaskLibAnswers, TaskLibAnswerExecResult, MockAnswers } from 'azure-pipelines-task-lib/mock-answer';
import mock from 'mock-require';
import { resetRequestedAnswers } from './mock-answer-spy'

export class TaskAnswers implements TaskLibAnswers {
    checkPath: { [key: string]: boolean; } = {};
    cwd: { [key: string]: string; } = {};
    exec: { [key: string]: TaskLibAnswerExecResult; } = {};
    exist: { [key: string]: boolean; } = {};
    find: { [key: string]: string[]; } = {};
    findMatch: { [key: string]: string[]; } = {};
    ls: { [key: string]: string; } = {};
    osType: { [key: string]: string; } = {};
    stats: { [key: string]: any; } = {};
    which: { [key: string]: string; } = {};
    rmRF: { [key: string]: { success: boolean; }; } = {};    
}

mock("azure-pipelines-task-lib/mock-answer", "./mock-answer-spy");

@binding([TaskAnswers])
export class TaskAnswersSteps {
    constructor(private answers: TaskAnswers) { } 

    @after()
    public clearExecutedCommandsSpy(){
        resetRequestedAnswers();
    }

    @given("terraform not exists")
    public answerTerraformNotExists(){
        this.answerToolExists("terraform", false);
    }

    @given("terraform exists")
    public answerTerraformExists(){
        this.answerToolExists("terraform", true);
    }

    @given("running command {string} returns successful result")
    public runningCommandReturnsSuccessfulResult(command: string){
        this.answers.exec[command] = <TaskLibAnswerExecResult>{
            stderr: '',
            stdout: `${command} run successful`,
            code: 0
        }
    }

    @given("running command {string} with the following options returns successful result")
    public runningCommandWithOptionsReturnsSuccessfulResult(command: string, table: TableDefinition){
        const args = table.rows();
        command = `${command} ${args.join(' ')}`

        this.answers.exec[command] = <TaskLibAnswerExecResult>{
            stderr: '',
            stdout: `${command} run successful`,
            code: 0
        }
    }

    @given("running command {string} fails with error {string}")
    public runningCommandFails(command: string, error: string){
        this.answers.exec[command] = <TaskLibAnswerExecResult>{
            stderr: error,
            stdout: ``,
            code: 1
        }
    }

    @given("running command {string} returns the following result")
    public runningCommandReturnsTheFollowingResult(command: string, table: TableDefinition){
        this.answers.exec[command] = <TaskLibAnswerExecResult><unknown>table.rowsHash();
    }

    private answerToolExists(tool: string, exists: boolean){
        this.answers.which["terraform"] = "terraform";
        this.answers.checkPath = this.answers.checkPath || {};
        this.answers.checkPath["terraform"] = exists;
        if(exists){
            this.answers.exec[`terraform version`] = <TaskLibAnswerExecResult>{
                code : 0,
                stdout : `version successful`
            }
        }
    }
}