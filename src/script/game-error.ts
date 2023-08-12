import { Error } from './error.js';


export function New(code: string, msg: string): Error {
    return { module: "Game", code: code, msg: msg };
}


export const InvalidOp: string = "INVALID_OPERATION";
