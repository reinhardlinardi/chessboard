import { Color, White } from "./color.js";


export type Score = number;
export type Reason = number;


export const WhiteWin: Score =  1;
export const Tie: Score = 0;
export const BlackWin: Score = -1;


export const ReasonWhiteCheckmate: Reason = 1;
export const ReasonBlackCheckmate: Reason = -1;
export const ReasonInsufficient: Reason = -2;
export const ReasonStalemate: Reason = 2;
export const ReasonRepetition: Reason = 3;
export const ReasonFiftyMove: Reason = 50;


export interface Result {
    score: Score,
    reason: Reason,
}


export function getScore(player: Color, win: boolean): Score {
    return (player === White? WhiteWin : BlackWin) * (win? 1 : -1);
}
