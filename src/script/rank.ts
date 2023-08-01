import * as Color from './color.js';

// Return absolute rank from relative rank
export function nthRank(color: string, n: number) {
    return color == Color.White? n : 9-n; 
}