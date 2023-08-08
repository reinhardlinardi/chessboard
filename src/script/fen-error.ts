import { Error } from './error.js';

export function New(code: string, msg: string): Error {
    return { module: "FEN", code: code, msg: msg };
}


export const InvalidFmt: string = "INVALID";
export const RegexNotMatch: string = "REGEX_NOT_MATCH";
