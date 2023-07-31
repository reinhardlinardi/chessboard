import * as Piece from '../../public/module/piece.js';
import * as Setup from '../../public/module/setup.js';
import { getPiece, setPiece } from '../../public/module/board.js';
import { copyPosition } from '../../public/module/util.js';


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
    const ori = Setup.getEmptySetup();
    const copy = copyPosition(ori);

    const rank = 4;
    const file = 4;

    const src = getPiece(ori, rank, file);
    setPiece(copy, rank, file, K);

    expect(getPiece(ori, rank, file)).toEqual(src);
});