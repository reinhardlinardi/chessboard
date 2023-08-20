import * as PieceMove from './piece-move.js';
import * as Direction from './piece-direction.js';
import { Color, Black, White } from './color.js';
import { Filter } from './filter.js';


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
    attack: PieceMove.Type,
};

export interface Piece extends AbstractPiece {
    color: Color,
    letter: string,
    move: Direction.Directions,
    capture: Direction.Directions,
};

export const Pawn: AbstractPiece = Object.freeze({
    type: TypePawn,
    value: 1,
    attack: PieceMove.TypeDirect,
});

export const Knight: AbstractPiece = Object.freeze({
    type: TypeKnight,
    value: 3,
    attack: PieceMove.TypeDirect,
});

export const Bishop: AbstractPiece = Object.freeze({
    type: TypeBishop,
    value: 3,
    attack: PieceMove.TypeRange,
});

export const Rook: AbstractPiece = Object.freeze({
    type: TypeRook,
    value: 5,
    attack: PieceMove.TypeRange,
});

export const Queen: AbstractPiece = Object.freeze({
    type: TypeQueen,
    value: 9,
    attack: PieceMove.TypeRange,
});

export const King: AbstractPiece = Object.freeze({
    type: TypeKing,
    value: 1000,
    attack: PieceMove.TypeDirect,
});

export const WhitePawn: Piece = Object.freeze({
    ...Pawn,
    color: White,
    letter: "P",
    move: Direction.WhitePawnAdvance,
    capture: Direction.WhitePawnCapture,
});

export const BlackPawn: Piece = Object.freeze({
    ...Pawn,
    color: Black,
    letter: "p",
    move: Direction.BlackPawnAdvance,
    capture: Direction.BlackPawnCapture,
});

export const WhiteKnight: Piece = Object.freeze({
    ...Knight,
    color: White,
    letter: "N",
    move: Direction.Knight,
    capture: Direction.Knight,
});

export const BlackKnight: Piece = Object.freeze({
    ...Knight,
    color: Black,
    letter: "n",
    move: Direction.Knight,
    capture: Direction.Knight,
});

export const WhiteBishop: Piece = Object.freeze({
    ...Bishop,
    color: White,
    letter: "B",
    move: Direction.Bishop,
    capture: Direction.Bishop,
});

export const BlackBishop: Piece = Object.freeze({
    ...Bishop,
    color: Black,
    letter: "b",
    move: Direction.Bishop,
    capture: Direction.Bishop,
});

export const WhiteRook: Piece = Object.freeze({
    ...Rook,
    color: White,
    letter: "R",
    move: Direction.Rook,
    capture: Direction.Rook,
});

export const BlackRook: Piece = Object.freeze({
    ...Rook,
    color: Black,
    letter: "r",
    move: Direction.Rook,
    capture: Direction.Rook,
});

export const WhiteQueen: Piece = Object.freeze({
    ...Queen,
    color: White,
    letter: "Q",
    move: Direction.Queen,
    capture: Direction.Queen,
});

export const BlackQueen: Piece = Object.freeze({
    ...Queen,
    color: Black,
    letter: "q",
    move: Direction.Queen,
    capture: Direction.Queen,
});

export const WhiteKing: Piece = Object.freeze({
    ...King,
    color: White,
    letter: "K",
    move: Direction.King,
    capture: Direction.King,
});

export const BlackKing: Piece = Object.freeze({
    ...King,
    color: Black,
    letter: "k",
    move: Direction.King,
    capture: Direction.King,
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
