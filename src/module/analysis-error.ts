import { Error } from './error.js';


export function New(code: string, msg: string): Error {
    return { module: "Analysis", code: code, msg: msg };
}


export const InvalidOp: string = "INVALID_OPERATION";
export const InvalidMove: string = "INVALID_MOVE";
export const SetupInvalidHalfmove: string = "SETUP_INVALID_HALFMOVE";
export const SetupInvalidKingCount: string = "SETUP_INVALID_KING_COUNT";
export const SetupInvalidPawnRank: string = "SETUP_INVALID_PAWN_RANK";
export const SetupInvalidPosition: string = "SETUP_INVALID_POSITION";
export const PromotionPieceTypeInvalid: string = "PROMOTION_PIECE_TYPE_INVALID";
