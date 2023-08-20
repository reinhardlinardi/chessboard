import * as Piece from './piece.js';
import * as File from './file.js';
import * as Location from './location.js';
import { nthRank } from './rank.js';
import { Filter } from './filter.js';
import { Color, White, Black } from './color.js';
import { Direction, Kingside, Queenside } from './direction.js';


export type Type = string;

export const TypeShort: Type = "O-O";
export const TypeLong: Type = "O-O-O";


export type Rights = {[type: Type]: boolean};


export interface Move {
    piece: string,
    direction: Direction,
    from: Location.Location,
};

export interface Castle {
    type: Type,
    color: Color,
    letter: string,
    king: Move,
    rook: Move,
};


const R = Piece.WhiteRook.letter;
const r = Piece.BlackRook.letter;
const Q = Piece.WhiteQueen.letter;
const q = Piece.BlackQueen.letter;
const K = Piece.WhiteKing.letter;
const k = Piece.BlackKing.letter;

const short = TypeShort;
const long = TypeLong;
const king = Piece.TypeKing;


export const WhiteShort: Castle = Object.freeze({
    type: short,
    color: White,
    letter: K,
    king: getPieceMove(K, short, White), 
    rook: getPieceMove(R, short, White),
});

export const BlackShort: Castle = Object.freeze({
    type: short,
    color: Black,
    letter: k,
    king: getPieceMove(k, short, Black), 
    rook: getPieceMove(r, short, Black),
});

export const WhiteLong: Castle = Object.freeze({
    type: long,
    color: White,
    letter: Q,
    king: getPieceMove(K, long, White), 
    rook: getPieceMove(R, long, White),
});

export const BlackLong: Castle = Object.freeze({
    type: long,
    color: Black,
    letter: q,
    king: getPieceMove(k, long, Black), 
    rook: getPieceMove(r, long, Black),
});


const list: readonly Castle[] = Object.freeze([WhiteShort, WhiteLong, BlackShort, BlackLong]);

export function getList(): Castle[] {
    return [...list];
}

// {"K": val, "Q": val, "k": val, "q": val}
export function getRights(val: boolean): Rights {
    return getList().map(castle => castle.letter).reduce((map, type) => ({...map, [type]: val}), {});
}


// {"K": WhiteShort, "Q": WhiteLong, "k": BlackShort, "q": BlackLong}
const map: {[letter: string]: Castle} = Object.freeze(
    list.reduce((map, castle) => ({...map, [castle.letter]: castle}), {})
);

export function get(letter: string): Castle {
    return map[letter];
}


export function byColor(color: Color): Filter<Castle> {
    return castle => castle.color === color;
}

export function byType(type: Type): Filter<Castle> {
    return castle => castle.type === type;
}



function getPieceFile(piece: Piece.Type, type: Type): string {
    if(piece === king) return File.e;
    return type === long? File.a : File.h;
}

function getPieceDirection(piece: Piece.Type, type: Type): Direction {
    if(piece === king) return type === long? 2*Queenside : 2*Kingside;
    return type === long? 3*Kingside : 2*Queenside;
}

function getPieceMove(piece: string, type: Type, color: Color): Move {
    const pieceType = Piece.get(piece).type;

    const rank = nthRank(1, color);
    const file = File.of(getPieceFile(pieceType, type));
    const direction = getPieceDirection(pieceType, type);
    
    return {piece: piece, direction: direction, from: Location.of(file, rank)};
}
