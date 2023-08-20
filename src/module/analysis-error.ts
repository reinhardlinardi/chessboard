import { Error } from './error.js';


export function New(code: string, msg: string): Error {
    return { module: "Analysis", code: code, msg: msg };
}


export const InvalidOp: string = "INVALID_OPERATION";
export const NoSetupLoaded: string = "NO_SETUP_LOADED";
export const InvalidHalfmove: string = "INVALID_HALFMOVE";
export const InvalidKingCount: string = "INVALID_KING_COUNT";
export const InvalidPawnRank: string = "INVALID_PAWN_RANK";
export const InvalidPosition: string = "INVALID_POSITION";
