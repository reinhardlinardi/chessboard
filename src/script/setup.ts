import * as Piece from './piece.js';
import * as Position from './position.js';

const na: string = Piece.None;
const wp: string = Piece.WhitePawn.letter;
const bp: string = Piece.BlackPawn.letter;
const wn: string = Piece.WhiteKnight.letter;
const bn: string = Piece.BlackKnight.letter;
const wb: string = Piece.WhiteBishop.letter;
const bb: string = Piece.BlackBishop.letter;
const wr: string = Piece.WhiteRook.letter;
const br: string = Piece.BlackRook.letter;
const wq: string = Piece.WhiteQueen.letter;
const bq: string = Piece.BlackQueen.letter;
const wk: string = Piece.WhiteKing.letter;
const bk: string = Piece.BlackKing.letter;

const defaultSetup: string[][] = [
    [wr, wn, wb, wq, wk, wb, wn, wr],
    [wp, wp, wp, wp, wp, wp, wp, wp],
    [na, na, na, na, na, na, na, na],
    [na, na, na, na, na, na, na, na],
    [na, na, na, na, na, na, na, na],
    [na, na, na, na, na, na, na, na],
    [bp, bp, bp, bp, bp, bp, bp, bp],
    [br, bn, bb, bq, bk, bb, bn, br]
]


export function getDefaultSetup(): string[][] {
    return Position.copy(defaultSetup);
}