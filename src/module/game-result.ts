import { Color, White } from "./color.js";


export type Result = number;


export const WhiteWin: Result =  1;
export const Draw: Result = 0;
export const BlackWin: Result = -1;


export function get(player: Color, win: boolean): Result {
    return (player === White? WhiteWin : BlackWin) * (win? 1 : -1);
}
