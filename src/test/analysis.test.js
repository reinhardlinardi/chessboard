import * as Piece from '../../public/module/piece.js';
import * as Setup from '../../public/module/setup.js';
import * as Loc from '../../public/module/location.js';
import * as Castle from '../../public/module/castle.js';
import * as Clock from '../../public/module/clock.js';
import * as File from '../../public/module/file.js';
import { Game } from '../../public/module/analysis.js';
import { White, Black } from '../../public/module/color.js';
import * as Err from '../../public/module/analysis-error.js';


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


test("Analysis-Game-loadSetup", () => {
    const tcs = [
        {
            name: "empty setup, all valid",
            state: {
                move: Black,
                clock: {halfmove: Clock.MaxHalfmove, fullmove: 10},
                enPassant: Loc.None,
                castle: Castle.getRights(false),
                pos: Setup.emptySetup(),
            },
            err: null,
            want: {
                move: Black,
                clock: {halfmove: Clock.MaxHalfmove, fullmove: 10},
                enPassant: Loc.None,
                castle: Castle.getRights(false),
                pos: Setup.emptySetup(),
            },
        },
        {
            name: "default setup, all valid",
            state: {
                move: White,
                clock: Clock.New(),
                enPassant: Loc.None,
                castle: Castle.getRights(true),
                pos: Setup.defaultSetup(),
            },
            err: null,
            want: {
                move: White,
                clock: Clock.New(),
                enPassant: Loc.None,
                castle: Castle.getRights(true),
                pos: Setup.defaultSetup(),
            },
        },
        {
            name: "default setup, invalid clocks",
            state: {
                move: White,
                clock: {halfmove: Clock.MaxHalfmove+1, fullmove: 0},
                enPassant: Loc.None,
                castle: Castle.getRights(true),
                pos: Setup.defaultSetup(),
            },
            err: null,
            want: {
                move: White,
                clock: {halfmove: Clock.MaxHalfmove+1, fullmove: Clock.FullmoveStart},
                enPassant: Loc.None,
                castle: Castle.getRights(true),
                pos: Setup.defaultSetup(),
            },
        },
        {
            name: "overwrite castle rights",
            state: {
                move: Black,
                clock: Clock.New(),
                enPassant: Loc.None,
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
                enPassant: Loc.None,
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
                enPassant: Loc.of(File.a, 7),
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
                enPassant: Loc.None,
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
                enPassant: Loc.of(File.c, 6),
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
                enPassant: Loc.None,
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
                enPassant: Loc.of(File.h, 6),
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
                enPassant: Loc.None,
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
                enPassant: Loc.of(File.b, 6),
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
                enPassant: Loc.None,
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
                enPassant: Loc.of(File.a, 3),
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
                enPassant: Loc.of(File.a, 3),
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
                enPassant: Loc.of(File.g, 3),
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
                enPassant: Loc.of(File.g, 3),
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
            game.loadSetup(tc.state);
        }
        catch(err) {
            expect(err.code).toEqual(tc.err);
        }
    
        if(!tc.err) {
            const s = game.getSetupData();
            const get = {pos: s.pos, move: s.move, castle: s.castle, enPassant: s.enPassant, clock: s.clock};
            expect(get).toEqual(tc.want);
        }
    }
})

test("Analysis-Game-validateSetup", () => {
    const tcs = [
        {
            name: "invalid halfmove",
            state: {
                move: White,
                clock: {
                    halfmove: Clock.MaxHalfmove + 1,
                    fullmove: Clock.FullmoveStart,
                },
                enPassant: Loc.None,
                castle: Castle.getRights(true),
                pos: Setup.defaultSetup(),
            },
            err: Err.SetupInvalidHalfmove,
        },
        {
            name: "no king",
            state: {
                move: Black,
                clock: Clock.New(),
                enPassant: Loc.None,
                castle: Castle.getRights(false),
                pos: Setup.emptySetup(),
            },
            err: Err.SetupInvalidKingCount,
        },
        {
            name: "one side no king",
            state: {
                move: Black,
                clock: Clock.New(),
                enPassant: Loc.None,
                castle: Castle.getRights(false),
                pos: [
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, k, _, q, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, Q, _, _, _],
                    [_, _, _, _, _, _, _, _],

                ].reverse(),
            },
            err: Err.SetupInvalidKingCount,
        },
        {
            name: "one side more than one king",
            state: {
                move: Black,
                clock: Clock.New(),
                enPassant: Loc.None,
                castle: Castle.getRights(false),
                pos: [
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, k, _, q, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, k, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, K, Q, _, _, _],
                    [_, _, _, _, _, _, _, _],

                ].reverse(),
            },
            err: Err.SetupInvalidKingCount,
        },
        {
            name: "pawn in rank 1",
            state: {
                move: White,
                clock: Clock.New(),
                enPassant: Loc.None,
                castle: Castle.getRights(false),
                pos: [
                    [_, _, _, q, k, _, _, _],
                    [p, p, p, p, p, p, p, p],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [P, P, P, P, P, P, P, P],
                    [_, _, _, Q, K, _, _, P],

                ].reverse(),
            },
            err: Err.SetupInvalidPawnRank,
        },
        {
            name: "pawn in rank 8",
            state: {
                move: White,
                clock: Clock.New(),
                enPassant: Loc.None,
                castle: Castle.getRights(false),
                pos: [
                    [_, p, _, q, k, _, _, _],
                    [p, p, p, p, p, p, p, p],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [P, P, P, P, P, P, P, P],
                    [_, _, _, Q, K, _, _, _],

                ].reverse(),
            },
            err: Err.SetupInvalidPawnRank,
        },
        {
            name: "opponent king in check 1",
            state: {
                move: White,
                clock: Clock.New(),
                enPassant: Loc.None,
                castle: Castle.getRights(false),
                pos: [
                    [_, _, _, q, k, _, _, _],
                    [p, p, p, P, p, p, p, p],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [P, P, P, P, P, P, P, P],
                    [_, _, _, Q, K, _, _, _],

                ].reverse(),
            },
            err: Err.SetupInvalidPosition,
        },
        {
            name: "opponent king in check 2",
            state: {
                move: White,
                clock: Clock.New(),
                enPassant: Loc.None,
                castle: Castle.getRights(false),
                pos: [
                    [_, _, _, q, k, _, _, _],
                    [p, p, p, p, p, p, p, p],
                    [_, _, _, _, _, N, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [P, P, P, P, P, P, P, P],
                    [_, _, _, Q, K, _, _, _],

                ].reverse(),
            },
            err: Err.SetupInvalidPosition,
        },
        {
            name: "opponent king in check 3",
            state: {
                move: White,
                clock: Clock.New(),
                enPassant: Loc.None,
                castle: Castle.getRights(false),
                pos: [
                    [_, _, _, q, k, _, _, R],
                    [p, p, p, p, p, p, p, p],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [P, P, P, P, P, P, P, P],
                    [_, _, _, Q, K, _, _, _],

                ].reverse(),
            },
            err: Err.SetupInvalidPosition,
        },
        {
            name: "opponent king in check 4",
            state: {
                move: White,
                clock: Clock.New(),
                enPassant: Loc.None,
                castle: Castle.getRights(false),
                pos: [
                    [_, _, _, q, k, _, _, _],
                    [p, p, p, _, p, p, p, p],
                    [_, _, _, _, _, _, _, _],
                    [_, B, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [P, P, P, P, P, P, P, P],
                    [_, _, _, Q, K, _, _, _],

                ].reverse(),
            },
            err: Err.SetupInvalidPosition,
        },
        {
            name: "opponent king in check 5",
            state: {
                move: White,
                clock: Clock.New(),
                enPassant: Loc.None,
                castle: Castle.getRights(false),
                pos: [
                    [_, _, _, q, k, _, _, _],
                    [p, p, p, p, _, p, p, p],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, Q, _, _, _],
                    [P, P, P, P, P, P, P, P],
                    [_, _, _, Q, K, _, _, _],

                ].reverse(),
            },
            err: Err.SetupInvalidPosition,
        },
        {
            name: "opponent king in check 6",
            state: {
                move: White,
                clock: Clock.New(),
                enPassant: Loc.None,
                castle: Castle.getRights(false),
                pos: [
                    [_, _, _, q, k, _, _, _],
                    [p, p, p, p, p, _, p, p],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, Q],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [P, P, P, P, P, P, P, P],
                    [_, _, _, Q, K, _, _, _],

                ].reverse(),
            },
            err: Err.SetupInvalidPosition,
        },
        {
            name: "king adjacent with opponent's",
            state: {
                move: White,
                clock: Clock.New(),
                enPassant: Loc.None,
                castle: Castle.getRights(false),
                pos: [
                    [_, _, _, q, _, _, _, _],
                    [p, p, p, p, p, p, p, p],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, k, _, _, _],
                    [_, _, _, _, K, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [P, P, P, P, P, P, P, P],
                    [_, _, _, Q, _, _, _, _],

                ].reverse(),
            },
            err: Err.SetupInvalidPosition,
        },
        {
            name: "king in check too many attackers 1",
            state: {
                move: White,
                clock: Clock.New(),
                enPassant: Loc.None,
                castle: Castle.getRights(false),
                pos: [
                    [_, _, _, q, k, _, _, _],
                    [p, p, p, p, p, p, p, p],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, n, _, n, _, _],
                    [P, P, P, P, P, P, P, P],
                    [_, _, _, Q, K, _, _, q],

                ].reverse(),
            },
            err: Err.SetupInvalidPosition,
        },
        {
            name: "king in check too many attackers 2",
            state: {
                move: White,
                clock: Clock.New(),
                enPassant: Loc.None,
                castle: Castle.getRights(false),
                pos: [
                    [_, _, _, q, k, _, _, _],
                    [p, p, p, p, p, p, p, p],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, n, _, n, _, _],
                    [P, P, P, P, P, P, P, P],
                    [r, _, _, Q, K, B, _, q],

                ].reverse(),
            },
            err: Err.SetupInvalidPosition,
        },
        {
            name: "valid 1",
            state: {
                move: White,
                clock: Clock.New(),
                enPassant: Loc.None,
                castle: Castle.getRights(false),
                pos: [
                    [_, _, _, q, k, _, _, _],
                    [p, p, p, p, p, p, p, p],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, n, _, _],
                    [P, P, P, P, P, P, P, P],
                    [r, _, _, Q, K, r, _, q],

                ].reverse(),
            },
            err: null,
        },
        {
            name: "valid 2",
            state: {
                move: White,
                clock: Clock.New(),
                enPassant: Loc.None,
                castle: Castle.getRights(false),
                pos: [
                    [_, _, _, q, k, _, _, _],
                    [p, p, p, p, _, p, p, p],
                    [_, _, b, _, _, _, _, _],
                    [_, _, _, _, p, _, _, _],
                    [_, _, _, _, K, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [P, P, P, P, P, P, P, P],
                    [_, _, _, Q, _, _, _, _],

                ].reverse(),
            },
            err: null,
        },
        {
            name: "valid 3",
            state: {
                move: White,
                clock: Clock.New(),
                enPassant: Loc.None,
                castle: Castle.getRights(false),
                pos: [
                    [_, _, _, q, _, _, _, _],
                    [p, p, p, p, _, k, p, p],
                    [_, _, b, _, N, n, _, _],
                    [_, _, _, B, p, _, _, _],
                    [_, _, _, _, K, _, _, r],
                    [_, _, _, _, _, _, _, _],
                    [P, P, P, P, P, P, P, P],
                    [_, _, _, Q, _, _, _, _],

                ].reverse(),
            },
            err: null,
        },
        {
            name: "valid 4",
            state: {
                move: White,
                clock: Clock.New(),
                enPassant: Loc.None,
                castle: Castle.getRights(false),
                pos: [
                    [_, q, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [k, _, _, _, _, _, _, _],
                    [_, _, _, _, _, _, _, _],
                    [K, _, _, _, _, _, _, _],

                ].reverse(),
            },
            err: null,
        },
    ];

    for(const tc of tcs) {
        const game = new Game();
        
        try {
            game.loadSetup(tc.state);
            game.validateSetup();
        }
        catch(err) {
            expect(err.code).toEqual(tc.err);
        }

        if(!tc.err) expect(() => game.validateSetup()).not.toThrow();
    }
})
