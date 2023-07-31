import * as Piece from '../../public/module/piece.js';
import {copyPosition} from '../../public/module/util.js';

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


test("util-copyPosition", () => {
    const ori = Array(8).fill(
        Array(8).fill(_)
    );

    const copy = copyPosition(ori);

    const src = ori[4][4];
    copy[4][4] = K;

    expect(ori[4][4]).toEqual(src);
});