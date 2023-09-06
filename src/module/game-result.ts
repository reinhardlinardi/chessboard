import { Color, White } from "./color.js";


export type Score = number;
export type Reason = number;


export const WhiteWin: Score =  1;
export const Draw: Score = 0;
export const BlackWin: Score = -1;


export const WhiteCheckmate: Reason = 1;
export const BlackCheckmate: Reason = -1;
export const Insufficient: Reason = -2;
export const Stalemate: Reason = 2;
export const Repetition: Reason = 3;
export const FiftyMove: Reason = 50;


export interface Result {
    ended: boolean,
    score: Score,
    reason: Reason,
}


export function getScore(player: Color, win: boolean): Score {
    return (player === White? WhiteWin : BlackWin) * (win? 1 : -1);
}
