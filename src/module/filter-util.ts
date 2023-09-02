import { Filter, New as newFilter } from './filter.js';
import { Piece, getList as pieceList } from './piece.js';
import { Castle, getList as castleList } from './castle.js';


const pieces = pieceList();
const castle = castleList();


export function getPiece(...filters: Filter<Piece>[]): Piece {
    return getPieces(...filters)[0];
}

export function getPieces(...filters: Filter<Piece>[]): Piece[] {
    return filterPiece(...filters);
}

export function getCastle(...filters: Filter<Castle>[]): Castle {
    return getCastleList(...filters)[0];
}

export function getCastleList(...filters: Filter<Castle>[]): Castle[] {
    return filterCastle(...filters);
}


function filterPiece(...filters: Filter<Piece>[]): Piece[] {
    return newFilter(pieces, ...filters)();
}

function filterCastle(...filters: Filter<Castle>[]): Castle[] {
    return newFilter(castle, ...filters)();
}
