import * as Draw from './draw.js';
import { Color, White } from "./color.js";


export type Score = number;

export const WhiteWin: Score =  1;
export const Tie: Score = 0;
export const BlackWin: Score = -1;


export interface Result {
    score: Score,
    drawReason: Draw.Reason,
}


export function getScore(player: Color, win: boolean): Score {
    return (player === White? WhiteWin : BlackWin) * (win? 1 : -1);
}
