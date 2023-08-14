import * as Move from './move.js';
import { Filter } from './filter.js';
import { Color, Black, White } from './color.js';


export const None: string = " ";

export type Type = number;

export const TypePawn: Type = 0;
export const TypeKnight: Type = 1;
export const TypeBishop: Type = 2;
export const TypeRook: Type = 3;
export const TypeQueen: Type = 4;
export const TypeKing: Type = 5;


export interface AbstractPiece {
    type: Type,
    value: number,
    range: boolean,
    jump: boolean,
};

export interface Piece extends AbstractPiece {
    color: Color,
    letter: string,
    moves: Move.Move[],
};

export const Pawn: AbstractPiece = Object.freeze({
    type: TypePawn,
    value: 1,
    range: false,
    jump: false,
});

export const Knight: AbstractPiece = Object.freeze({
    type: TypeKnight,
    value: 3,
    range: false,
    jump: true,
});

export const Bishop: AbstractPiece = Object.freeze({
    type: TypeBishop,
    value: 3,
    range: true,
    jump: false,
});

export const Rook: AbstractPiece = Object.freeze({
    type: TypeRook,
    value: 5,
    range: true,
    jump: false,
});

export const Queen: AbstractPiece = Object.freeze({
    type: TypeQueen,
    value: 9,
    range: true,
    jump: false,
});

export const King: AbstractPiece = Object.freeze({
    type: TypeKing,
    value: 1000,
    range: false,
    jump: false,
});

export const WhitePawn: Piece = Object.freeze({
    ...Pawn,
    color: White,
    letter: "P",
    moves: [Move.WhitePawnAdvance, Move.WhitePawnCapture],
});

export const BlackPawn: Piece = Object.freeze({
    ...Pawn,
    color: Black,
    letter: "p",
    moves: [Move.BlackPawnAdvance, Move.BlackPawnCapture],
});

export const WhiteKnight: Piece = Object.freeze({
    ...Knight,
    color: White,
    letter: "N",
    moves: [Move.Knight],
});

export const BlackKnight: Piece = Object.freeze({
    ...Knight,
    color: Black,
    letter: "n",
    moves: [Move.Knight],
});

export const WhiteBishop: Piece = Object.freeze({
    ...Bishop,
    color: White,
    letter: "B",
    moves: [Move.Bishop],
});

export const BlackBishop: Piece = Object.freeze({
    ...Bishop,
    color: Black,
    letter: "b",
    moves: [Move.Bishop],
});

export const WhiteRook: Piece = Object.freeze({
    ...Rook,
    color: White,
    letter: "R",
    moves: [Move.Rook],
});

export const BlackRook: Piece = Object.freeze({
    ...Rook,
    color: Black,
    letter: "r",
    moves: [Move.Rook],
});

export const WhiteQueen: Piece = Object.freeze({
    ...Queen,
    color: White,
    letter: "Q",
    moves: [Move.Queen],
});

export const BlackQueen: Piece = Object.freeze({
    ...Queen,
    color: Black,
    letter: "q",
    moves: [Move.Queen],
});

export const WhiteKing: Piece = Object.freeze({
    ...King,
    color: White,
    letter: "K",
    moves: [Move.King],
});

export const BlackKing: Piece = Object.freeze({
    ...King,
    color: Black,
    letter: "k",
    moves: [Move.King],
});


const P = WhitePawn;
const p = BlackPawn;
const N = WhiteKnight;
const n = BlackKnight;
const B = WhiteBishop;
const b = BlackBishop;
const R = WhiteRook;
const r = BlackRook;
const Q = WhiteQueen;
const q = BlackQueen;
const K = WhiteKing;
const k = BlackKing;


// [WhitePawn, WhiteKnight, ..., BlackPawn, BlackKnight, ...]
const list: readonly Piece[] = Object.freeze([P, N, B, R, Q, K, p, n, b, r, q, k]);

export function getList(): Piece[] {
    return [...list];
}


// {"P": WhitePawn, "p": BlackPawn, ...}
const map: {[letter: string]: Piece} = Object.freeze(
    list.reduce((map, piece) => ({...map, [piece.letter]: piece}), {})
);

export function get(letter: string): Piece {
    return map[letter];
}



export function byColor(color: Color): Filter<Piece> {
    return piece => piece.color === color;
}

export function byType(type: Type): Filter<Piece> {
    return piece => piece.type === type;
}
