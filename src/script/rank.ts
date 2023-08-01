import * as Color from './color.js';

// Return absolute rank from relative rank
export function nthRank(n: number, color: string) {
    return color == Color.White? n : 9-n; 
}