import { stat } from "fs";

export class TerraformError extends Error {
    constructor(name: string, message: string, stack?: string | undefined) {
        super(message);
        this.name = name;
        this.stack = stack;
    }
}
