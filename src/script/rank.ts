import { Color, White } from './color.js';

// Return absolute rank from relative rank
export function nthRank(n: number, color: Color): number {
    return color === White? n : 9-n; 
}
