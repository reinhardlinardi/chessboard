import { Color, White } from "./color.js";


export type Score = number;

export const None: Score = -2;
export const WhiteWin: Score = 1;
export const Draw: Score = 0;
export const BlackWin: Score = -1;


export function get(player: Color, win: boolean): Score {
    return (player === White? WhiteWin : BlackWin) * (win? 1 : -1);
}
