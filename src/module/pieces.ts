import * as Piece from './piece.js';
import { Color } from './color.js';
import { Type } from './piece-type.js';
import { Filter, filter } from './filter.js';


const P = Piece.WhitePawn;
const p = Piece.BlackPawn;
const N = Piece.WhiteKnight;
const n = Piece.BlackKnight;
const B = Piece.WhiteBishop;
const b = Piece.BlackBishop;
const R = Piece.WhiteRook;
const r = Piece.BlackRook;
const Q = Piece.WhiteQueen;
const q = Piece.BlackQueen;
const K = Piece.WhiteKing;
const k = Piece.BlackKing;


// [WhitePawn, WhiteKnight, ..., BlackPawn, BlackKnight, ...]
const list: readonly Piece.Piece[] = Object.freeze([P, N, B, R, Q, K, p, n, b, r, q, k]);

export function getList(): Piece.Piece[] {
    return [...list];
}


// {"P": WhitePawn, "p": BlackPawn, ...}
const map: {[letter: string]: Piece.Piece} = Object.freeze(
    list.reduce((map, piece) => ({...map, [piece.letter]: piece}), {})
);

export function get(letter: string): Piece.Piece {
    return map[letter];
}


export function byColor(color: Color): Filter<Piece.Piece> {
    return piece => piece.color === color;
}

export function byType(type: Type): Filter<Piece.Piece> {
    return piece => piece.type === type;
}


export function getBy(color: Color, type: Type): Piece.Piece {
    return filter(getList(), byType(type), byColor(color))[0];
}

export function getByColor(color: Color): Piece.Piece[] {
    return filter(getList(), byColor(color));
}

export function getByType(type: Type): Piece.Piece[] {
    return filter(getList(), byType(type));
}
