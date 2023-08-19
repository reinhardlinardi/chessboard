import { Error } from './error.js';


export function New(code: string, msg: string): Error {
    return { module: "GamePosition", code: code, msg: msg };
}


export const ConflictParam: string = "CONFLICTING_PARAM";
