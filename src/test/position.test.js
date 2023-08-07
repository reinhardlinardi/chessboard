import * as Piece from '../../public/module/piece.js';
import * as Setup from '../../public/module/setup.js';
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


test("Position-copy", () => {
    const ori = Setup.emptySetup();
    const clone = Position.copy(ori);

    expect(clone).not.toBe(ori);
    expect(clone).toEqual(ori);
})
