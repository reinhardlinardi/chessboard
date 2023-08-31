import * as DeadPos from '../../public/module/dead-position.js';
import * as Piece from '../../public/module/piece.js';


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


// {"P": 0, "N": 0, "B": 0, "R": 0, "Q": 0, "K": 0, "p": 0, "n": 0, "b": 0, "r": 0, "q": 0, "k": 0}
const base = Piece.getList().reduce((map, piece) => ({...map, [piece.letter]: 0}), {});

test("DeadPosition-isDead", () => {
    const tcs = [
        {
            name: "K vs K",
            count: {[K]: 1, [k]: 1},
            want: true,
        },
        {
            name: "KN vs K",
            count: {[K]: 1, [N]: 1, [k]: 1},
            want: true,
        },
        {
            name: "K vs KB",
            count: {[K]: 1, [k]: 1, [b]: 1},
            want: true,
        },
        {
            name: "KN vs KB",
            count: {[K]: 1, [N]: 1, [k]: 1, [b]: 1},
            want: false,
        },
        {
            name: "K vs KNB",
            count: {[K]: 1, [k]: 1, [n]: 1, [b]: 1},
            want: false,
        },
        {
            name: "KP vs K",
            count: {[K]: 1, [P]: 1, [k]: 1},
            want: false,
        },
        {
            name: "KB vs KB",
            count: {[K]: 1, [B]: 1, [k]: 1, [b]: 1},
            want: false,
        },
        {
            name: "KN vs KN",
            count: {[K]: 1, [N]: 1, [k]: 1, [n]: 1},
            want: false,
        },
        {
            name: "KNN vs K",
            count: {[K]: 1, [N]: 2, [k]: 1},
            want: false,
        },
        {
            name: "K vs KBB",
            count: {[K]: 1, [k]: 1, [b]: 2},
            want: false,
        },
        {
            name: "default setup",
            count: {[P]: 8, [N]: 2, [B]: 2, [R]: 2, [Q]: 1, [K]: 1, [p]: 8, [n]: 2, [b]: 2, [r]: 2, [q]: 1, [k]: 1},
            want: false,
        },
    ];

    for(const tc of tcs) {
        const count = {...base};
        for(const piece in tc.count) count[piece] = tc.count[piece];

        expect(DeadPos.isDead(count)).toEqual(tc.want);
    }
})
