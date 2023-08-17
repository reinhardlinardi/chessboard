import { Error } from './error.js';


export function New(code: string, msg: string): Error {
    return { module: "Analysis", code: code, msg: msg };
}


export const InvalidOp: string = "INVALID_OPERATION";
export const InvalidHalfmove: string = "INVALID_HALFMOVE";
export const InvalidKingCount: string = "INVALID_KING_COUNT";
export const InvalidPawnRank: string = "INVALID_PAWN_RANK";
