import * as Piece from '../../public/module/piece.js';
import * as Editor from '../../public/module/editor.js';
import * as Setup from '../../public/module/setup.js';
import * as Square from '../../public/module/square.js';
import * as File from '../../public/module/file.js';
import { White, Black } from '../../public/module/color.js';


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
            pos: Setup.emptySetup(),
        },
        {
            name: "default",
            types: all,
            want: [true, true, true, true],
            pos: Setup.defaultSetup(),
        },
        {
            name: "king out of place",
            types: all,
            want: [false, false, false, false],
            pos: [
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
            pos: [
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
            pos: [
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
            const get = Editor.hasCastlePosition(tc.types[idx], tc.pos);
            expect(get).toEqual(tc.want[idx]);
        }
    }
})

test("Editor-genEnPassantTargets",() => {
    const tcs = [
        {
            name: "default",
            color: White,
            want: [],
            pos: Setup.defaultSetup(),
        },
        {
            name: "no option",
            color: White,
            want: [],
            pos: [
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
            color: White,
            want: [],
            pos: [
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
            color: White,
            want: [],
            pos: [
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
            color: White,
            want: [Square.of(File.d, 6)],
            pos: [
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
            color: White,
            want: [Square.of(File.b, 6)],
            pos: [
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
            color: White,
            want: [Square.of(File.a, 6)],
            pos: [
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
            color: Black,
            want: [],
            pos: [
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
            color: Black,
            want: [],
            pos: [
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
            color: Black,
            want: [
                Square.of(File.c, 3), 
                Square.of(File.e, 3),
            ],
            pos: [
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
            color: Black,
            want: [Square.of(File.d, 3)],
            pos: [
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
            color: Black,
            want: [
                Square.of(File.a, 3),
                Square.of(File.d, 3),
                Square.of(File.f, 3),
                Square.of(File.g, 3),
            ],
            pos: [
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
            color: White,
            want: [],
            pos: [
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
        const get = Editor.getEnPassantTargets(tc.color, tc.pos);
        expect(get).toEqual(tc.want);
    }
})
