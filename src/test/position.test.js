import * as Piece from '../../public/module/piece.js';
import * as Position from '../../public/module/position.js';

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


test("position-copy", () => {
    const ori = Array(8).fill(
        Array(8).fill(_)
    );

    const copy = Position.copy(ori);

    const rank = Math.round(Math.random() * 7) + 1;
    const file = Math.round(Math.random() * 7) + 1;
    
    const src = ori[rank-1][file-1];
    copy[rank-1][file-1] = K;

    expect(ori[rank-1][file-1]).toBe(src);
});