import * as Piece from '../../public/module/piece.js';
import * as Editor from '../../public/module/editor.js';
import * as Setup from '../../public/module/setup.js';
import * as Color from '../../public/module/color.js';
import * as Square from '../../public/module/square.js';
import * as File from '../../public/module/file.js';


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

const all = [K, Q, k, q];

test("Editor-hasCastlePosition", () => {
    const tcs = [
        {
            name: "empty",
            types: all,
            want: [false, false, false, false],
            board: Setup.emptySetup(),
        },
        {
            name: "default",
            types: all,
            want: [true, true, true, true],
            board: Setup.defaultSetup(),
        },
        {
            name: "king out of place",
            types: all,
            want: [false, false, false, false],
            board: [
                [r, n, b, q, K, _, _, r],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [R, _, _, Q, k, B, N, R],
            
            ].reverse(),
        },
        {
            name: "1 rook out of place",
            types: [K, Q],
            want: [true, false],
            board: [
                [r, n, b, q, k, _, _, r],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, R, _, Q, K, B, N, R],
            
            ].reverse(),
        },
        {
            name: "both rooks out of place",
            types: [k, q],
            want: [false, false],
            board: [
                [R, r, b, q, k, _, _, R],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [R, _, _, Q, K, B, N, R],
            
            ].reverse(),
        },
    ];

    for(const tc of tcs) {
        for(let idx = 0; idx < tc.types.length; idx++) {
            const get = Editor.hasCastlePosition(tc.types[idx], tc.board);
            expect(get).toEqual(tc.want[idx]);
        }
    }
});


const wh = Color.White;
const bk = Color.Black;

test("Editor-genEnPassantTargets",() => {
    const tcs = [
        {
            name: "default",
            color: wh,
            want: [],
            board: Setup.defaultSetup(),
        },
        {
            name: "no option",
            color: wh,
            want: [],
            board: [
                [_, _, _, _, k, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, P, _, _, _],
                [_, _, _, p, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, K, _, _, _],
            
            ].reverse(),
        },
        {
            name: "wrong rank",
            color: wh,
            want: [],
            board: [
                [_, _, _, _, k, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, p, P, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, K, _, _, _],
            
            ].reverse(),
        },
        {
            name: "not adjacent",
            color: wh,
            want: [],
            board: [
                [_, _, _, _, k, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, p, _, P, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, K, _, _, _],
            
            ].reverse(),
        },
        {
            name: "single target, player pawn on left",
            color: wh,
            want: [Square.of(File.d, 6)],
            board: [
                [_, _, _, _, k, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, P, p, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, K, _, _, _],
            
            ].reverse(),
        },
        {
            name: "single target, player pawn on right",
            color: wh,
            want: [Square.of(File.b, 6)],
            board: [
                [_, _, _, _, k, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, p, P, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, K, _, _, _],
            
            ].reverse(),
        },
        {
            name: "single target, player pawn on edge",
            color: wh,
            want: [Square.of(File.a, 6)],
            board: [
                [_, _, _, _, k, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [p, P, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, K, _, _, _],
            
            ].reverse(),
        },
        {
            name: "both player pawn",
            color: bk,
            want: [],
            board: [
                [_, _, _, _, k, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, p, p, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, K, _, _, _],
            
            ].reverse(),
        },
        {
            name: "both opponent pawn",
            color: bk,
            want: [],
            board: [
                [_, _, _, _, k, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, P, P, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, K, _, _, _],
            
            ].reverse(),
        },
        {
            name: "one player pawn, multiple opponent pawns",
            color: bk,
            want: [
                Square.of(File.c, 3), 
                Square.of(File.e, 3),
            ],
            board: [
                [_, _, _, _, k, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, P, p, P, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, K, _, _, _],
            
            ].reverse(),
        },
        {
            name: "multiple player pawns, one opponent pawn",
            color: bk,
            want: [Square.of(File.d, 3)],
            board: [
                [_, _, _, _, k, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, p, P, p, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, K, _, _, _],
            
            ].reverse(),
        },
        {
            name: "interleaving",
            color: bk,
            want: [
                Square.of(File.a, 3),
                Square.of(File.d, 3),
                Square.of(File.f, 3),
                Square.of(File.g, 3),
            ],
            board: [
                [_, _, _, _, k, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [P, p, p, P, p, P, P, p],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, K, _, _, _],
            
            ].reverse(),
        },
        {
            name: "opponent move next",
            color: wh,
            want: [],
            board: [
                [_, _, _, _, k, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, P, p, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, K, _, _, _],
            
            ].reverse(),
        },
    ];

    for(const tc of tcs) {
        const get = Editor.getEnPassantTargets(tc.color, tc.board);
        expect(get).toEqual(tc.want);
    }
});
