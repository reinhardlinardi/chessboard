import * as Piece from '../../public/module/piece.js';
import * as Setup from '../../public/module/setup.js';
import * as Location from '../../public/module/location.js';
import * as Castle from '../../public/module/castle.js';
import * as Clock from '../../public/module/clock.js';
import * as File from '../../public/module/file.js';
import { Game } from '../../public/module/game.js';
import { White, Black } from '../../public/module/color.js';
import * as Err from '../../public/module/game-error.js';


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


test("Game-loadState", () => {
    const tcs = [
        {
            name: "empty setup, all valid",
            state: {
                move: Black,
                clock: {halfmove: Clock.MaxHalfmove, fullmove: 10},
                enPassant: Location.None,
                castle: Castle.getRights(false),
                pos: Setup.emptySetup(),
            },
            err: null,
            want: {
                move: Black,
                clock: {halfmove: Clock.MaxHalfmove, fullmove: 10},
                enPassant: Location.None,
                castle: Castle.getRights(false),
                pos: Setup.emptySetup(),
            },
        },
        {
            name: "default setup, all valid",
            state: {
                move: White,
                clock: Clock.New(),
                enPassant: Location.None,
                castle: Castle.getRights(true),
                pos: Setup.defaultSetup(),
            },
            err: null,
            want: {
                move: White,
                clock: Clock.New(),
                enPassant: Location.None,
                castle: Castle.getRights(true),
                pos: Setup.defaultSetup(),
            },
        },
        {
            name: "default setup, invalid clocks",
            state: {
                move: White,
                clock: {halfmove: Clock.MaxHalfmove+1, fullmove: 0},
                enPassant: Location.None,
                castle: Castle.getRights(true),
                pos: Setup.defaultSetup(),
            },
            err: null,
            want: {
                move: White,
                clock: Clock.New(),
                enPassant: Location.None,
                castle: Castle.getRights(true),
                pos: Setup.defaultSetup(),
            },
        },
        {
            name: "overwrite castle rights",
            state: {
                move: Black,
                clock: Clock.New(),
                enPassant: Location.None,
                castle: {[K]: true, [Q]: true, [k]: false, [q]: false},
                pos: [  
                    [_, r, _, _, k, _, _, r],
                    [_, q, _, _, p, p, p, _],
                    [_, _, _, _, _, _, n, _],
                    [p, p, _, p, _, _, _, p],
                    [P, _, _, N, _, _, _, P],
                    [_, P, _, _, _, P, P, _],
                    [_, _, P, P, P, Q, R, _],
                    [R, _, _, _, K, _, _, _],

                ].reverse(),
            },
            err: null,
            want: {
                move: Black,
                clock: Clock.New(),
                enPassant: Location.None,
                castle: {[K]: false, [Q]: true, [k]: false, [q]: false},
                pos: [
                    [_, r, _, _, k, _, _, r],
                    [_, q, _, _, p, p, p, _],
                    [_, _, _, _, _, _, n, _],
                    [p, p, _, p, _, _, _, p],
                    [P, _, _, N, _, _, _, P],
                    [_, P, _, _, _, P, P, _],
                    [_, _, P, P, P, Q, R, _],
                    [R, _, _, _, K, _, _, _],

                ].reverse(),
            },
        },
        {
            name: "en passant invalid target rank",
            state: {
                move: White,
                clock: Clock.New(),
                enPassant: Location.of(File.fileOf(File.a), 7),
                castle: Castle.getRights(false),
                pos: [  
                    [_, r, _, _, k, _, _, _],
                    [_, q, _, _, p, p, p, r],
                    [_, _, _, p, _, _, n, _],
                    [p, p, P, _, _, _, _, p],
                    [P, _, _, N, _, _, _, P],
                    [_, P, _, _, _, P, P, _],
                    [R, _, _, P, P, Q, R, _],
                    [_, _, _, _, K, _, _, _],

                ].reverse(),
            },
            err: null,
            want: {
                move: White,
                clock: Clock.New(),
                enPassant: Location.None,
                castle: Castle.getRights(false),
                pos: [  
                    [_, r, _, _, k, _, _, _],
                    [_, q, _, _, p, p, p, r],
                    [_, _, _, p, _, _, n, _],
                    [p, p, P, _, _, _, _, p],
                    [P, _, _, N, _, _, _, P],
                    [_, P, _, _, _, P, P, _],
                    [R, _, _, P, P, Q, R, _],
                    [_, _, _, _, K, _, _, _],

                ].reverse(),
            },
        },
        {
            name: "en passant invalid square 1",
            state: {
                move: White,
                clock: Clock.New(),
                enPassant: Location.of(File.fileOf(File.c), 6),
                castle: Castle.getRights(false),
                pos: [  
                    [_, r, _, _, k, _, _, _],
                    [_, q, _, _, p, p, p, r],
                    [_, _, _, p, _, _, n, _],
                    [p, p, P, _, _, _, _, p],
                    [P, _, _, N, _, _, _, P],
                    [_, P, _, _, _, P, P, _],
                    [R, _, _, P, P, Q, R, _],
                    [_, _, _, _, K, _, _, _],

                ].reverse(),
            },
            err: null,
            want: {
                move: White,
                clock: Clock.New(),
                enPassant: Location.None,
                castle: Castle.getRights(false),
                pos: [  
                    [_, r, _, _, k, _, _, _],
                    [_, q, _, _, p, p, p, r],
                    [_, _, _, p, _, _, n, _],
                    [p, p, P, _, _, _, _, p],
                    [P, _, _, N, _, _, _, P],
                    [_, P, _, _, _, P, P, _],
                    [R, _, _, P, P, Q, R, _],
                    [_, _, _, _, K, _, _, _],

                ].reverse(),
            },
        },
        {
            name: "en passant invalid square 2",
            state: {
                move: White,
                clock: Clock.New(),
                enPassant: Location.of(File.fileOf(File.h), 6),
                castle: Castle.getRights(false),
                pos: [  
                    [_, r, _, _, k, _, _, _],
                    [_, q, _, _, p, p, p, r],
                    [_, _, _, p, _, _, n, _],
                    [p, p, P, _, _, _, _, p],
                    [P, _, _, N, _, _, _, P],
                    [_, P, _, _, _, P, P, _],
                    [R, _, _, P, P, Q, R, _],
                    [_, _, _, _, K, _, _, _],

                ].reverse(),
            },
            err: null,
            want: {
                move: White,
                clock: Clock.New(),
                enPassant: Location.None,
                castle: Castle.getRights(false),
                pos: [  
                    [_, r, _, _, k, _, _, _],
                    [_, q, _, _, p, p, p, r],
                    [_, _, _, p, _, _, n, _],
                    [p, p, P, _, _, _, _, p],
                    [P, _, _, N, _, _, _, P],
                    [_, P, _, _, _, P, P, _],
                    [R, _, _, P, P, Q, R, _],
                    [_, _, _, _, K, _, _, _],

                ].reverse(),
            },
        },
        {
            name: "en passant wrong move",
            state: {
                move: Black,
                clock: Clock.New(),
                enPassant: Location.of(File.fileOf(File.b), 6),
                castle: Castle.getRights(false),
                pos: [  
                    [_, r, _, _, k, _, _, _],
                    [_, q, _, _, p, p, p, r],
                    [_, _, _, p, _, _, n, _],
                    [p, p, P, _, _, _, _, p],
                    [P, _, _, N, _, _, _, P],
                    [_, P, _, _, _, P, P, _],
                    [R, _, _, P, P, Q, R, _],
                    [_, _, _, _, K, _, _, _],

                ].reverse(),
            },
            err: null,
            want: {
                move: Black,
                clock: Clock.New(),
                enPassant: Location.None,
                castle: Castle.getRights(false),
                pos: [  
                    [_, r, _, _, k, _, _, _],
                    [_, q, _, _, p, p, p, r],
                    [_, _, _, p, _, _, n, _],
                    [p, p, P, _, _, _, _, p],
                    [P, _, _, N, _, _, _, P],
                    [_, P, _, _, _, P, P, _],
                    [R, _, _, P, P, Q, R, _],
                    [_, _, _, _, K, _, _, _],

                ].reverse(),
            },
        },
        {
            name: "en passant valid 1",
            state: {
                move: Black,
                clock: Clock.New(),
                enPassant: Location.of(File.fileOf(File.a), 3),
                castle: Castle.getRights(false),
                pos: [  
                    [_, r, _, _, k, _, _, _],
                    [_, q, _, _, p, p, p, r],
                    [_, _, _, p, _, _, n, _],
                    [p, _, _, _, _, _, _, p],
                    [P, p, _, N, _, _, _, P],
                    [_, P, _, _, _, P, P, _],
                    [R, _, P, P, P, Q, R, _],
                    [_, _, _, _, K, _, _, _],

                ].reverse(),
            },
            err: null,
            want: {
                move: Black,
                clock: Clock.New(),
                enPassant: Location.of(File.fileOf(File.a), 3),
                castle: Castle.getRights(false),
                pos: [  
                    [_, r, _, _, k, _, _, _],
                    [_, q, _, _, p, p, p, r],
                    [_, _, _, p, _, _, n, _],
                    [p, _, _, _, _, _, _, p],
                    [P, p, _, N, _, _, _, P],
                    [_, P, _, _, _, P, P, _],
                    [R, _, P, P, P, Q, R, _],
                    [_, _, _, _, K, _, _, _],

                ].reverse(),
            },
        },
        {
            name: "en passant valid 2",
            state: {
                move: Black,
                clock: Clock.New(),
                enPassant: Location.of(File.fileOf(File.g), 3),
                castle: Castle.getRights(false),
                pos: [  
                    [_, r, _, _, k, _, _, _],
                    [_, q, _, _, p, p, p, r],
                    [_, _, _, p, _, _, n, _],
                    [p, _, _, _, _, _, _, _],
                    [_, _, P, N, _, _, P, p],
                    [P, P, _, _, _, P, _, P],
                    [R, _, _, P, P, Q, R, _],
                    [_, _, _, _, K, _, _, _],

                ].reverse(),
            },
            err: null,
            want: {
                move: Black,
                clock: Clock.New(),
                enPassant: Location.of(File.fileOf(File.g), 3),
                castle: Castle.getRights(false),
                pos: [  
                    [_, r, _, _, k, _, _, _],
                    [_, q, _, _, p, p, p, r],
                    [_, _, _, p, _, _, n, _],
                    [p, _, _, _, _, _, _, _],
                    [_, _, P, N, _, _, P, p],
                    [P, P, _, _, _, P, _, P],
                    [R, _, _, P, P, Q, R, _],
                    [_, _, _, _, K, _, _, _],

                ].reverse(),
            },
        },
    ];

    for(const tc of tcs) {
        const game = new Game();

        try {
            game.loadState(tc.state);
        }
        catch(err) {
            expect(err.code).toEqual(tc.err);
            continue;
        }

        const get = game.getInitialGameState().state;
        expect(get).toEqual(tc.want);
    }
})
