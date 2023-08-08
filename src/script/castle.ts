import * as Piece from './piece.js';
import * as File from './file.js';
import * as Square from './square.js';
import { Color, White, Black } from './color.js';
import { nthRank } from './rank.js';
import { Direction } from './direction.js';


export type Type = string;

export const TypeShort: Type = "O-O";
export const TypeLong: Type = "O-O-O";

export interface Move {
    piece: string,
    direction: Direction,
    from: Square.Square,
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


export const WhiteShort: Castle = Object.freeze({
    type: TypeShort,
    color: White,
    letter: K,
    king: getPieceMove(K, TypeShort, White), 
    rook: getPieceMove(R, TypeShort, White),
});

export const BlackShort: Castle = Object.freeze({
    type: TypeShort,
    color: Black,
    letter: k,
    king: getPieceMove(k, TypeShort, Black), 
    rook: getPieceMove(r, TypeShort, Black),
});

export const WhiteLong: Castle = Object.freeze({
    type: TypeLong,
    color: White,
    letter: Q,
    king: getPieceMove(K, TypeLong, White), 
    rook: getPieceMove(R, TypeLong, White),
});

export const BlackLong: Castle = Object.freeze({
    type: TypeLong,
    color: Black,
    letter: q,
    king: getPieceMove(k, TypeLong, Black), 
    rook: getPieceMove(r, TypeLong, Black),
});


const list: readonly Castle[] = Object.freeze([WhiteShort, WhiteLong, BlackShort, BlackLong]);

export function getList(): Castle[] {
    return [...list];
}


export type Filter = (castle: Castle) => boolean;

export function colorFilter(color: Color): Filter {
    return castle => castle.color === color;
}

export function typeFilter(type: Type): Filter {
    return castle => castle.type === type;
}


export function filterBy(...filters: Filter[]): Castle[] {
    let res = getList();
    for(const f of filters) {
        res = res.filter(f);
    }
    return res;
}


// {"K": WhiteShort, "Q": WhiteLong, "k": BlackShort, "q": BlackLong}
const map: {[letter: string]: Castle} = Object.freeze(
    list.reduce((map, castle) => ({...map, [castle.letter]: castle}), {})
);

export function get(letter: string): Castle {
    return map[letter];
}


export function getPieceFile(piece: string, type: Type): string {
    const pieceType = Piece.get(piece).type;

    if(pieceType === Piece.TypeKing) return File.e;
    else return (type === TypeLong)? File.a : File.h;
}

export function getPieceDirection(piece: string, type: Type): Direction {
    const pieceType = Piece.get(piece).type;
    
    if(pieceType === Piece.TypeKing) return (type === TypeLong)? -2 : 2;
    else return (type === TypeLong)? 3 : -2;
}

export function getPieceMove(piece: string, type: Type, color: Color): Move {
    const direction = getPieceDirection(piece, type);
    const rank = nthRank(1, color);
    const file = getPieceFile(piece, type);

    return {piece: piece, direction: direction, from: Square.of(file, rank)};
}
