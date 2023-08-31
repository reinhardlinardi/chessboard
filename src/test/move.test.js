import * as Piece from '../../public/module/piece.js';
import * as State from '../../public/module/state.js';
import * as Move from '../../public/module/move.js';
import * as Castle from '../../public/module/castle.js';
import * as Loc from '../../public/module/location.js';
import * as File from '../../public/module/file.js';
import * as Clock from '../../public/module/clock.js';
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


test("Move-getLegalMoves", () => {
    const tcs = [
        {
            name: "default setup",
            state: State.New(),
            want: {
                11: [],
                12: [31, 33],
                13: [],
                14: [],
                15: [],
                16: [],
                17: [36, 38],
                18: [],
                21: [31, 41],
                22: [32, 42],
                23: [33, 43],
                24: [34, 44],
                25: [35, 45],
                26: [36, 46],
                27: [37, 47],
                28: [38, 48],
            },
        },
        {
            name: "random, white move",
            state: {
                move: White,
                clock: Clock.New(),
                enPassant: Loc.of(File.h, 6),
                castle: Castle.getRights(true),
                pos: [
                    [r, q, _, _, k, _, _, r],
                    [p, p, _, b, _, p, p, _],
                    [_, _, n, _, _, n, _, _],
                    [_, _, _, p, _, _, P, p],
                    [_, b, p, P, p, _, _, P],
                    [_, P, N, _, _, _, N, _],
                    [P, B, P, _, P, P, B, _],
                    [R, _, _, _, K, Q, _, R],

                ].reverse(),
            },
            want: {
                11: [12, 13, 14],
                15: [13, 14, 24],
                16: [17],
                18: [17, 28, 38],
                21: [31, 41],
                22: [13, 31],
                23: [],
                25: [35],
                26: [36, 46],
                27: [38, 36, 45],
                32: [43],
                33: [12, 14, 45, 54, 52, 41],
                37: [45, 56, 58],
                44: [],
                48: [],
                57: [66, 67, 68],
            },
        },
        {
            name: "random, black move",
            state: {
                move: Black,
                clock: Clock.New(),
                enPassant: Loc.of(File.d, 3),
                castle: Castle.getRights(true),
                pos: [
                    [r, q, _, _, k, _, _, r],
                    [p, p, _, b, _, p, p, _],
                    [_, _, n, _, _, n, _, _],
                    [_, _, _, p, _, _, P, p],
                    [_, b, p, P, p, _, _, P],
                    [_, P, N, _, _, _, N, _],
                    [P, B, P, _, P, P, B, _],
                    [R, _, _, _, K, Q, _, R],

                ].reverse(),
            },
            want: {
                42: [31, 51, 35, 64, 75, 86, 33],
                43: [32, 34],
                45: [34, 35],
                54: [],
                58: [],
                63: [51, 44, 55, 75, 84],
                66: [47, 78, 87],
                71: [61, 51],
                72: [62, 52],
                74: [83, 65, 56, 47, 38],
                76: [],
                77: [67],
                81: [],
                82: [83, 84, 73, 64, 55, 46, 37],
                85: [84, 75, 86, 87],
                88: [86, 87, 78, 68],
            },
        },
    ];

    for(const tc of tcs) {
        const get = Move.getLegalMoves(tc.state);
        const want = tc.want;
        
        expect(Object.keys(get).length).toEqual(Object.keys(want).length);

        for(const loc in want) {
            expect(loc in get).toEqual(true);
            expect(get[loc].length).toEqual(want[loc].length);
            for(const square of want[loc]) expect(get[loc].includes(square));
        }
    }
})
