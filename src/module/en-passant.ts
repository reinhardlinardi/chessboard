import * as Loc from './location.js';
import { Color } from './color.js';
import { nthRank } from './rank.js';
import { Size as size } from './size.js';


const TargetRank: number = 6;
const PawnRank: number = TargetRank - 1;


export function targetRank(player: Color) {
    return nthRank(TargetRank, player);
}

export function pawnRank(player: Color) {
    return nthRank(PawnRank, player);
}

export function opponentPawnLoc(file: number, player: Color): Loc.Location {
    return Loc.of(file, pawnRank(player));
}

export function playerPawnsLoc(file: number, player: Color): Loc.Location[] {
    let loc: Loc.Location[] = [];

    if(file > 1) loc.push(Loc.of(file-1, pawnRank(player)));
    if(file < size) loc.push(Loc.of(file+1, pawnRank(player)));
    return loc;
}
