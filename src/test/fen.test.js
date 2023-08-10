import * as Piece from '../../public/module/piece.js';
import * as FEN from '../../public/module/fen.js';
import * as Setup from '../../public/module/setup.js';
import * as Clock from '../../public/module/clock.js';
import { White, Black } from '../../public/module/color.js';
import * as Err from '../../public/module/fen-error.js';


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


test("FEN-generate", () => {
    const tcs = [
        {
            name: "empty, black move",
            state: {
                move: Black,
                clock: Clock.New(),
                enPassant: "",
                castle: {[K]: false, [Q]: false, [k]: false, [q]: false},
                pos: Setup.emptySetup(),
            },
            want: "8/8/8/8/8/8/8/8 b - - 0 1",
        },
        {
            name: "default",
            state: {
                move: White,
                clock: Clock.New(),
                enPassant: "",
                castle: {[K]: true, [Q]: true, [k]: true, [q]: true},
                pos: Setup.defaultSetup(),
            },
            want: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        },
        {
            name: "all other cases",
            state: {
                move: Black,
                clock: {
                    halfmove: 99,
                    fullmove: 100,
                },
                enPassant: "c3",
                castle: {[K]: true, [Q]: false, [k]: false, [q]: true},
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

test("FEN-load", () => {
    const tcs = [
        {
            name: "random string",
            str: " lorem ipsum  dolor amet ",
            err: Err.InvalidNumFields,
            want: {},
        },
        {
            name: "too few fields",
            str: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0",
            err: Err.InvalidNumFields,
            want: {},
        },
        {
            name: "too many fields",
            str: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 10 20",
            err: Err.InvalidNumFields,
            want: {},
        },
        {
            name: "too few rows",
            str: "rnbqkbnr/pppppppp/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            err: Err.InvalidSyntax,
            want: {},
        },
        {
            name: "too many rows",
            str: "rnbqkbnr/pppppppp/8/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            err: Err.InvalidSyntax,
            want: {},
        },
        {
            name: "wrong delimiter",
            str: "rnbqkbnr,pppppppp,8,8,8,PPPPPPPP,RNBQKBNR w KQkq - 0 1",
            err: Err.InvalidSyntax,
            want: {},
        },
        {
            name: "invalid piece code",
            str: "rnbqkbnr/pppZpppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            err: Err.InvalidSyntax,
            want: {},
        },
        {
            name: "0 empty squares",
            str: "rnbqkbnr/pppppppp/0/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            err: Err.InvalidSyntax,
            want: {},
        },
        {
            name: "9 empty squares",
            str: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBN9 w KQkq - 0 1",
            err: Err.InvalidSyntax,
            want: {},
        },
        {
            name: "10 empty squares",
            str: "rnbqkbnr/pppppppp/8/8/8/10/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            err: Err.InvalidSyntax,
            want: {},
        },
        {
            name: "invalid color",
            str: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR B KQkq - 0 1",
            err: Err.InvalidSyntax,
            want: {},
        },
        {
            name: "invalid castling",
            str: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w w - 0 1",
            err: Err.InvalidSyntax,
            want: {},
        },
        {
            name: "invalid en passant",
            str: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - x4 0 1",
            err: Err.InvalidSyntax,
            want: {},
        },
        {
            name: "negative clock",
            str: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - -0 -1",
            err: Err.InvalidSyntax,
            want: {},
        },
        {
            name: "invalid row square count",
            str: "rnbqkbnr/pppppppp/8/8/8/8/PPPP2PPP/RNBQKBNR w KQkq - 0 1",
            err: Err.InvalidRowNumSquares,
            want: {},
        },
    ];

    for(const tc of tcs) {
        try {
            const get = FEN.load(tc.str);
            expect(get).toEqual(tc.want);
        }
        catch(err) {
            // console.log(err.msg);
            expect(err.code).toEqual(tc.err);
        }
    }
});
