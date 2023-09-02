import { Error } from './error.js';


export function New(code: string, msg: string): Error {
    return { module: "Analysis", code: code, msg: msg };
}


export const InvalidOp: string = "INVALID_OPERATION";
export const InvalidMove: string = "INVALID_MOVE";
export const InvalidPromotion: string = "INVALID_PROMOTION";
export const SetupHalfmove: string = "INVALID_HALFMOVE";
export const SetupKingCount: string = "INVALID_KING_COUNT";
export const SetupPawnRank: string = "INVALID_PAWN_RANK";
export const SetupPosition: string = "INVALID_POSITION";
