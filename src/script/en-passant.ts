import * as Location from './location.js';
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

export function opponentPawn(file: number, player: Color): Location.Location {
    return Location.of(file, pawnRank(player));
}

export function playerPawn(file: number, player: Color): Location.Location[] {
    let loc: Location.Location[] = [];

    if(file > 1) loc.push(Location.of(file-1, pawnRank(player)));
    if(file < size) loc.push(Location.of(file+1, pawnRank(player)));
    return loc;
}
