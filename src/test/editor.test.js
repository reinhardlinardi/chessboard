import * as Editor from '../../public/module/editor.js';
import * as Piece from '../../public/module/piece.js';

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


test("editor-setDefaultSetup", () => {
    const editor = new Editor.Editor();
    editor.setDefaultSetup();

    const want = [
        [r, n, b, q, k, b, n, r],
        [p, p, p, p, p, p, p, p],
        [_, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _],
        [P, P, P, P, P, P, P, P],
        [R, N, B, Q, K, B, N, R],

    ].reverse();

    const get = editor.getPosition();
    expect(get).toEqual(want);
});

test("editor-clear", ()=> {
    const editor = new Editor.Editor();
    editor.clear();

    const want = Array(8).fill(
        Array(8).fill(_)
    );

    const get = editor.getPosition();
    expect(get).toEqual(want);
});

test("editor-setPiece", () => {
    const editor = new Editor.Editor();
    editor.clear();

    editor.setPiece(1, 1, K);
    editor.setPiece(8, 8, k);

    const get = editor.getPosition();
    expect(get[0][0]).toEqual(K);
    expect(get[7][7]).toEqual(k);
});