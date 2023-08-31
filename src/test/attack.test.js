import * as Piece from '../../public/module/piece.js';
import * as Setup from '../../public/module/setup.js';
import * as Attack from '../../public/module/attack.js';
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


test("Attack-getAttackersOf", () => {
    const tcs = [
        {
            name: "default setup",
            color: White,
            want: {
                61: [72, 82],
                62: [71, 73],
                63: [72, 74, 82],
                64: [73, 75],
                65: [74, 76],
                66: [75, 77, 87],
                67: [76, 78],
                68: [77, 87],
                71: [81],
                72: [83],
                73: [84],
                74: [82, 83, 84, 85],
                75: [84, 85, 86, 87],
                76: [85],
                77: [86],
                78: [88],
                82: [81],
                83: [84],
                84: [85],
                85: [84],
                86: [85],
                87: [88],
            },
            pos: Setup.defaultSetup(),
        },
        {
            name: "random, white move",
            color: White,
            want: {
                32: [43],
                33: [51],
                34: [43],
                41: [74],
                42: [51],
                43: [83],
                45: [66],
                47: [58, 66],
                52: [74],
                53: [64, 83],
                54: [65, 66],
                55: [64],
                56: [65],
                58: [66, 88],
                61: [72],
                62: [51, 71],
                63: [72, 74, 83],
                65: [74, 76],
                66: [77],
                67: [76],
                68: [77, 88],
                71: [81],
                72: [83],
                73: [51, 83],
                74: [66, 83, 85],
                75: [85],
                76: [85],
                78: [66, 88],
                81: [83],
                82: [81, 83],
                83: [74, 81],
                84: [51, 83, 85],
                85: [66, 74, 83, 88],
                86: [85, 88],
                87: [66, 88],
            },
            pos: [
                [r, _, q, _, k, _, _, r],
                [p, p, _, b, _, p, p, _],
                [_, _, _, p, p, n, _, _],
                [b, _, _, _, _, _, P, p],
                [_, _, p, P, _, _, _, P],
                [_, _, N, _, _, N, _, _],
                [P, P, P, _, P, P, B, _],
                [R, _, _, Q, K, _, _, R],

            ].reverse(),
        },
        {
            name: "random, black move",
            color: Black,
            want: {
                11: [14],
                12: [11, 14, 33],
				13: [11, 14],
                14: [11, 15, 33],
                15: [14, 18, 36],
				16: [15, 18, 27],
				17: [18, 36],
                18: [27],
                21: [11, 33],
                23: [14],
				24: [14, 15, 36],
                25: [14, 15, 33],
                26: [15],
				28: [18, 36],
				31: [22],
				32: [21, 23],
				33: [22],
                34: [14, 23, 25],
				35: [26],
                36: [25, 27],
				37: [26],
				38: [18, 27],
				41: [33],
                44: [14, 36],
                45: [33],
                48: [18, 36],
				52: [33],
				53: [44],
				54: [33],
				55: [36, 44],
                57: [36, 48],
				66: [57],
				68: [57],
            },
            pos: [
                [r, _, q, _, k, _, _, r],
                [p, p, _, b, _, p, p, _],
                [_, _, _, p, p, n, _, _],
                [b, _, _, _, _, _, P, p],
                [_, _, p, P, _, _, _, P],
                [_, _, N, _, _, N, _, _],
                [P, P, P, _, P, P, B, _],
                [R, _, _, Q, K, _, _, R],

            ].reverse(),
        },
    ];

    for(const tc of tcs) {
        const get = Attack.getAttackersOf(tc.color, tc.pos);
        const want = tc.want;
        
        console.log(tc.name);
        expect(Object.keys(get).length).toEqual(Object.keys(want).length);

        for(const loc in want) {
            expect(loc in get).toEqual(true);
            expect(get[loc].length).toEqual(want[loc].length);
            for(const square of want[loc]) expect(get[loc].includes(square));
        }
    }
})
