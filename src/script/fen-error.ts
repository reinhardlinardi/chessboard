import { Error } from './error.js';

export function New(code: string, msg: string): Error {
    return { module: "FEN", code: code, msg: msg };
}


export const InvalidNumFields: string = "INVALID_NUM_FIELDS";
export const InvalidSyntax: string = "INVALID_SYNTAX";
export const InvalidRowNumSquares: string = "INVALID_ROW_NUM_SQUARES";
