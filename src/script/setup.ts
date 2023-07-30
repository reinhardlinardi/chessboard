import * as Piece from './piece.js';
import * as Position from './position.js';

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


const defaultSetup: string[][] = [
    [r, n, b, q, k, b, n, r],
    [p, p, p, p, p, p, p, p],
    [_, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _],
    [P, P, P, P, P, P, P, P],
    [R, N, B, Q, K, B, N, R],

].reverse();

export function getDefaultSetup(): string[][] {
    return Position.copy(defaultSetup);
}