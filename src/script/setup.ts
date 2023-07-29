import * as Piece from './piece.js';
import * as Position from './position.js';

const _: string = Piece.None;
const P: string = Piece.WhitePawn.letter;
const p: string = Piece.BlackPawn.letter;
const N: string = Piece.WhiteKnight.letter;
const n: string = Piece.BlackKnight.letter;
const B: string = Piece.WhiteBishop.letter;
const b: string = Piece.BlackBishop.letter;
const R: string = Piece.WhiteRook.letter;
const r: string = Piece.BlackRook.letter;
const Q: string = Piece.WhiteQueen.letter;
const q: string = Piece.BlackQueen.letter;
const K: string = Piece.WhiteKing.letter;
const k: string = Piece.BlackKing.letter;

const defaultSetup: string[][] = [
    [R, N, B, Q, K, B, N, R],
    [P, P, P, P, P, P, P, P],
    [_, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _],
    [p, p, p, p, p, p, p, p],
    [r, n, b, q, k, b, n, r]
]


export function getDefaultSetup(): string[][] {
    return Position.copy(defaultSetup);
}