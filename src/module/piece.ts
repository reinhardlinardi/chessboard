import * as AbstractPiece from './abstract-piece.js';
import * as PieceMove from './piece-move.js';
import { Color, Black, White } from './color.js';
import { Type } from './piece-type.js';
import { Filter } from './filter.js';


export const None: string = " ";


export interface Piece extends AbstractPiece.Piece {
    color: Color,
    letter: string,
    moves: PieceMove.Move[],
};

export const WhitePawn: Piece = Object.freeze({
    ...AbstractPiece.Pawn,
    color: White,
    letter: "P",
    moves: [PieceMove.WhitePawnAdvance, PieceMove.WhitePawnCapture],
});

export const BlackPawn: Piece = Object.freeze({
    ...AbstractPiece.Pawn,
    color: Black,
    letter: "p",
    moves: [PieceMove.BlackPawnAdvance, PieceMove.BlackPawnCapture],
});

export const WhiteKnight: Piece = Object.freeze({
    ...AbstractPiece.Knight,
    color: White,
    letter: "N",
    moves: [PieceMove.Knight],
});

export const BlackKnight: Piece = Object.freeze({
    ...AbstractPiece.Knight,
    color: Black,
    letter: "n",
    moves: [PieceMove.Knight],
});

export const WhiteBishop: Piece = Object.freeze({
    ...AbstractPiece.Bishop,
    color: White,
    letter: "B",
    moves: [PieceMove.Bishop],
});

export const BlackBishop: Piece = Object.freeze({
    ...AbstractPiece.Bishop,
    color: Black,
    letter: "b",
    moves: [PieceMove.Bishop],
});

export const WhiteRook: Piece = Object.freeze({
    ...AbstractPiece.Rook,
    color: White,
    letter: "R",
    moves: [PieceMove.Rook],
});

export const BlackRook: Piece = Object.freeze({
    ...AbstractPiece.Rook,
    color: Black,
    letter: "r",
    moves: [PieceMove.Rook],
});

export const WhiteQueen: Piece = Object.freeze({
    ...AbstractPiece.Queen,
    color: White,
    letter: "Q",
    moves: [PieceMove.Queen],
});

export const BlackQueen: Piece = Object.freeze({
    ...AbstractPiece.Queen,
    color: Black,
    letter: "q",
    moves: [PieceMove.Queen],
});

export const WhiteKing: Piece = Object.freeze({
    ...AbstractPiece.King,
    color: White,
    letter: "K",
    moves: [PieceMove.King],
});

export const BlackKing: Piece = Object.freeze({
    ...AbstractPiece.King,
    color: Black,
    letter: "k",
    moves: [PieceMove.King],
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
