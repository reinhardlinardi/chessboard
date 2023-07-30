import * as Color from './color.js';
import * as Piece from './piece.js';
import * as Square from './square.js';
import * as File from './file.js';

export const None: string = "";

export const TypeShort: string = "O-O";
export const TypeLong: string = "O-O-O";


export interface Castle {
    type: string,
    color: string,
    letter: string,
    king: Square.Square,
    rook: Square.Square,
};

export const WhiteShort: Castle = {
    type: TypeShort,
    color: Color.White,
    letter: Piece.WhiteKing.letter,
    king: Square.of(File.e, 1),
    rook: Square.of(File.h, 1),
};

export const BlackShort: Castle = {
    type: TypeShort,
    color: Color.Black,
    letter: Piece.BlackKing.letter,
    king: Square.of(File.e, 8),
    rook: Square.of(File.h, 8),
};

export const WhiteLong: Castle = {
    type: TypeLong,
    color: Color.White,
    letter: Piece.WhiteQueen.letter,
    king: Square.of(File.e, 1),
    rook: Square.of(File.a, 1),
};

export const BlackLong: Castle = {
    type: TypeLong,
    color: Color.Black,
    letter: Piece.BlackQueen.letter,
    king: Square.of(File.e, 8),
    rook: Square.of(File.a, 8),
};


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

export function getTypes(color: string): Castle[] {
    return list[color];
};

export function get(letter: string): Castle {
    return map[letter];
};