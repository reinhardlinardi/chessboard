import { Color, White } from './color.js';
import { Size as size } from './size.js';

// Return absolute rank from relative rank
export function nthRank(n: number, color: Color): number {
    return color === White? n : size+1-n; 
}
