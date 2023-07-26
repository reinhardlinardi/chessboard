import * as Piece from './piece.js';
import * as util from './util.js';

const none: string = Piece.None;
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

export const Empty: string[][] = [
    util.splitRow(none.repeat(8).split(""))[0],
    util.splitRow(none.repeat(8).split(""))[0],
    util.splitRow(none.repeat(8).split(""))[0],
    util.splitRow(none.repeat(8).split(""))[0],
    util.splitRow(none.repeat(8).split(""))[0],
    util.splitRow(none.repeat(8).split(""))[0],
    util.splitRow(none.repeat(8).split(""))[0],
    util.splitRow(none.repeat(8).split(""))[0],
];

export const Default: string[][] = [
    util.splitRow([wr, wn, wb, wq, wk, wb, wn, wr])[0],
    util.splitRow([wp.repeat(8)])[0],
    util.splitRow([none.repeat(8)])[0],
    util.splitRow([none.repeat(8)])[0],
    util.splitRow([none.repeat(8)])[0],
    util.splitRow([none.repeat(8)])[0],
    util.splitRow([bp.repeat(8)])[0],
    util.splitRow([br, bn, bb, bq, bk, bb, bn, br])[0],
]