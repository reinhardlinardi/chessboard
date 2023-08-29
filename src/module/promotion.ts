import * as p from "./piece-type.js";
import { Color } from "./color.js";
import { nthRank } from "./rank.js";


export const Promoted: p.Type = p.TypePawn;
const rank: number = 8;


export function promoteRank(color: Color): number {
    return nthRank(rank, color);
}


const list: readonly p.Type[] = Object.freeze(
    [p.TypeQueen, p.TypeRook, p.TypeBishop, p.TypeKnight]
);

export function getTypes(): p.Type[] {
    return [...list];
}

export function canPromoteTo(t: p.Type): boolean {
    return list.includes(t);
}
