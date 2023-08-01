import * as Color from './color.js';
import * as Piece from './piece.js';
import * as Square from './square.js';
import * as File from './file.js';
import { Direction } from './move.js';


export const None: string = "";

export const TypeShort: string = "O-O";
export const TypeLong: string = "O-O-O";


export interface Move {
    piece: string,
    direction: Direction,
    from: Square.Square,
}

export interface Castle {
    type: string,
    color: string,
    letter: string,
    king: Move,
    rook: Move,
};


const R = Piece.WhiteRook.letter;
const r = Piece.BlackRook.letter;
const Q = Piece.WhiteQueen.letter;
const q = Piece.BlackQueen.letter;
const K = Piece.WhiteKing.letter;
const k = Piece.BlackKing.letter;


export const WhiteShort: Castle = Object.freeze({
    type: TypeShort,
    color: Color.White,
    letter: K,
    king: {
        piece: K,
        direction: 2,
        from: Square.of(File.e, 1),
    },
    rook: {
        piece: R,
        direction: -2,
        from: Square.of(File.h, 1),
    },
});

export const BlackShort: Castle = Object.freeze({
    type: TypeShort,
    color: Color.Black,
    letter: k,
    king: {
        piece: k,
        direction: 2,
        from: Square.of(File.e, 8),
    },
    rook: {
        piece: r,
        direction: -2,
        from: Square.of(File.h, 8),
    },
});

export const WhiteLong: Castle = Object.freeze({
    type: TypeLong,
    color: Color.White,
    letter: Q,
    king: {
        piece: K,
        direction: -2,
        from: Square.of(File.e, 1),
    },
    rook: {
        piece: R,
        direction: 3,
        from: Square.of(File.a, 1),
    },
});

export const BlackLong: Castle = Object.freeze({
    type: TypeLong,
    color: Color.Black,
    letter: q,
    king: {
        piece: k,
        direction: -2,
        from: Square.of(File.e, 8),
    },
    rook: {
        piece: r,
        direction: 3,
        from: Square.of(File.a, 8),
    },
});


const ws = WhiteShort;
const bs = BlackShort;
const wl = WhiteLong;
const bl = BlackLong;

const w = Color.White;
const b = Color.Black;


const list: {[key: string]: Castle[]} = {
    [w]: [ws, wl],
    [b]: [bs, bl],
};

const map: {[key: string]: Castle} = [...list[w], ...list[b]].reduce(
    (map, castle) => ({...map, [castle.letter]: castle}),
    {},
);

export function getByColor(color: string): Castle[] {
    return list[color];
}

export function get(letter: string): Castle {
    return map[letter];
}