import * as Piece from './piece.js';
import { Board } from './type.js';
import { copyPosition } from './util.js';

const _ = Piece.None;
const P = Piece.WhitePawn.letter;
const p = Piece.BlackPawn.letter;
const N = Piece.WhiteKnight.letter;
const n = Piece.BlackKnight.letter;
const B = Piece.WhiteBishop.letter;
const b = Piece.BlackBishop.letter;
const R = Piece.WhiteRook.letter;
const r = Piece.BlackRook.letter;
const Q = Piece.WhiteQueen.letter;
const q = Piece.BlackQueen.letter;
const K = Piece.WhiteKing.letter;
const k = Piece.BlackKing.letter;


const emptySetup: Board = [
    [_, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _],
]

const defaultSetup: Board = [
    [r, n, b, q, k, b, n, r],
    [p, p, p, p, p, p, p, p],
    [_, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _],
    [P, P, P, P, P, P, P, P],
    [R, N, B, Q, K, B, N, R],

].reverse();

export function getEmptySetup(): Board {
    return copyPosition(emptySetup);
}

export function getDefaultSetup(): Board {
    return copyPosition(defaultSetup);
}