import * as Piece from '../../public/module/piece.js';
import * as FEN from '../../public/module/fen.js';
import * as Setup from '../../public/module/setup.js';
import * as Color from '../../public/module/color.js';
import * as Clock from '../../public/module/clock.js';


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

const wh = Color.White;
const bk = Color.Black;

const t = true;
const f = false;


test("FEN-generate", () => {
    const tcs = [
        {
            name: "empty, black move",
            state: {
                move: bk,
                clock: Clock.New(),
                enPassant: "",
                castle: {
                    [K]: f,
                    [Q]: f,
                    [k]: f,
                    [q]: f,
                },
                pos: Setup.emptySetup(),
            },
            want: "8/8/8/8/8/8/8/8 b - - 0 1",
        },
        {
            name: "default",
            state: {
                move: wh,
                clock: Clock.New(),
                enPassant: "",
                castle: {
                    [K]: t,
                    [Q]: t,
                    [k]: t,
                    [q]: t,
                },
                pos: Setup.defaultSetup(),
            },
            want: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        },
        {
            name: "all other cases",
            state: {
                move: bk,
                clock: {
                    halfmove: 99,
                    fullmove: 100,
                },
                enPassant: "c3",
                castle: {
                    [K]: t,
                    [Q]: f,
                    [k]: f,
                    [q]: t,
                },
                pos: [
                    [r, _, _, _, k, _, _, _],
                    [b, _, _, n, _, b, _, q],
                    [_, R, r, _, _, _, _, p],
                    [P, p, p, n, p, p, p, _],
                    [P, _, P, p, P, _, P, P],
                    [_, N, _, _, _, P, _, _],
                    [_, _, _, B, B, _, _, N],
                    [_, Q, _, _, K, _, _, R],
                
                ].reverse(),
            },
            want: "r3k3/b2n1b1q/1Rr4p/Pppnppp1/P1PpP1PP/1N3P2/3BB2N/1Q2K2R b Kq c3 99 100",
        },
    ];

    for(const tc of tcs) {
        const get = FEN.generate(tc.state);
        expect(get).toEqual(tc.want);
    }
});
