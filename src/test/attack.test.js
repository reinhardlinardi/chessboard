import * as Piece from '../../public/module/piece.js';
import * as Setup from '../../public/module/setup.js';
import * as Attack from '../../public/module/attack.js';
import * as Loc from '../../public/module/location.js';
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


test("Attack-getAttackersLoc", () => {
    const tcs = [
        {
            name: "empty setup",
            color: Black,
            loc: Loc.of(File.a, 8),
            want: [],
            pos: Setup.emptySetup(),
        },
        {
            name: "default setup",
            color: White,
            loc: Loc.of(File.f, 2),
            want: [],
            pos: Setup.defaultSetup(),
        },
        {
            name: "color not equal piece color",
            color: Black,
            loc: Loc.of(File.f, 2),
            want: [],
            pos: Setup.defaultSetup(),
        },
        {
            name: "knight attacker",
            color: White,
            loc: Loc.of(File.e, 1),
            want: [
                Loc.of(File.d, 3),
            ],
            pos: [
                [_, _, _, _, k, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, n, _, _, _, _],
                [_, _, _, P, P, P, _, _],
                [_, _, _, _, K, _, _, _],

            ].reverse(),
        },
        {
            name: "pawn attacker",
            color: White,
            loc: Loc.of(File.e, 1),
            want: [
                Loc.of(File.f, 2),
            ],
            pos: [
                [_, _, _, _, k, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, P, P, p, _, _],
                [_, _, _, _, K, _, _, _],

            ].reverse(),
        },
        {
            name: "bishop attacker",
            color: White,
            loc: Loc.of(File.e, 1),
            want: [
                Loc.of(File.h, 4),
            ],
            pos: [
                [_, _, _, _, k, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, b],
                [_, _, _, _, _, _, _, _],
                [_, _, _, P, P, _, _, _],
                [_, _, _, _, K, _, _, _],

            ].reverse(),
        },
        {
            name: "rook attacker",
            color: White,
            loc: Loc.of(File.e, 1),
            want: [
                Loc.of(File.a, 1),
            ],
            pos: [
                [_, _, _, _, k, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, P, P, _, _, _],
                [r, _, _, _, K, _, _, R],

            ].reverse(),
        },
        {
            name: "queen attacker",
            color: White,
            loc: Loc.of(File.e, 1),
            want: [
                Loc.of(File.a, 5),
            ],
            pos: [
                [_, _, _, _, k, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [q, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, P, _, _, _],
                [_, _, _, _, K, _, _, _],

            ].reverse(),
        },
        {
            name: "multiple attackers",
            color: White,
            loc: Loc.of(File.e, 1),
            want: [
                Loc.of(File.h, 4),
                Loc.of(File.g, 1),
            ],
            pos: [
                [_, _, _, _, k, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, b],
                [_, _, _, _, _, _, _, _],
                [_, _, _, P, P, _, _, _],
                [_, _, _, _, K, _, r, _],

            ].reverse(),
        },
        {
            name: "king attacker",
            color: Black,
            loc: Loc.of(File.e, 7),
            want: [
                Loc.of(File.e, 6),
            ],
            pos: [
                [_, _, _, _, k, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, K, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],

            ].reverse(),
        },
        {
            name: "attack blocked 1",
            color: Black,
            loc: Loc.of(File.e, 8),
            want: [],
            pos: [
                [_, _, _, _, k, b, _, R],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, K, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],

            ].reverse(),
        },
        {
            name: "attack blocked 2",
            color: Black,
            loc: Loc.of(File.e, 8),
            want: [],
            pos: [
                [_, _, _, _, k, B, _, R],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, K, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],

            ].reverse(),
        },
        {
            name: "1 attack blocked",
            color: Black,
            loc: Loc.of(File.e, 8),
            want: [
                Loc.of(File.e, 1),
            ],
            pos: [
                [_, _, _, _, k, b, _, R],
                [_, _, _, _, _, _, _, _],
                [_, _, K, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, _, _, _, _],
                [_, _, _, _, Q, _, _, _],

            ].reverse(),
        },
    ];

    for(const tc of tcs) {
        let get;

        try {
            get = Attack.getAttackersLoc(tc.pos, tc.color, tc.loc);
        }
        catch(err) {
            expect(err.code).toEqual(tc.err);
        }

        if(!tc.err) {
            expect(get.length).toEqual(tc.want.length);
            for(const loc of tc.want) expect(get.includes(loc)).toEqual(true);
        }
    }
})
