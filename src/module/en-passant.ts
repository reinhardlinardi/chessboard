import * as Loc from './location.js';
import { Color } from './color.js';
import { nthRank } from './rank.js';
import { Size as size } from './size.js';


type Location = Loc.Location;


const FromRank: number = 7;
const TargetRank: number = FromRank - 1;
const PawnsRank: number = FromRank - 2;


export function targetRank(player: Color) {
    return nthRank(TargetRank, player);
}

export function fromRank(player: Color) {
    return nthRank(FromRank, player);
}

export function pawnRank(player: Color) {
    return nthRank(PawnsRank, player);
}


export function targetLoc(file: number, player: Color): Location {
    return Loc.of(file, targetRank(player));
}

export function opponentPawnFromLoc(file: number, player: Color): Location {
    return Loc.of(file, fromRank(player));
}

export function opponentPawnLoc(file: number, player: Color): Location {
    return Loc.of(file, pawnRank(player));
}

export function playerPawnsLoc(file: number, player: Color): Location[] {
    let loc: Location[] = [];

    if(file > 1) loc.push(Loc.of(file-1, pawnRank(player)));
    if(file < size) loc.push(Loc.of(file+1, pawnRank(player)));
    return loc;
}
