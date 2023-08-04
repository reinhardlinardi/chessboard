import * as Color from './color.js';
import * as Move from './move.js';

export const None: string = " ";

export const TypePawn: number = 0;
export const TypeKnight: number = 1;
export const TypeBishop: number = 2;
export const TypeRook: number = 3;
export const TypeQueen: number = 4;
export const TypeKing: number = 5;


export interface AbstractPiece {
    type: number,
    value: number,
    range: boolean,
    jump: boolean,
};

export interface Piece extends AbstractPiece {
    color: string,
    letter: string,
    moves: Move.Move[],
};

export const Pawn: AbstractPiece = Object.freeze({
    type: TypePawn,
    value: 1,
    range: false,
    jump: false,
});

export const Knight: AbstractPiece = Object.freeze({
    type: TypeKnight,
    value: 3,
    range: false,
    jump: true,
});

export const Bishop: AbstractPiece = Object.freeze({
    type: TypeBishop,
    value: 3,
    range: true,
    jump: false,
});

export const Rook: AbstractPiece = Object.freeze({
    type: TypeRook,
    value: 5,
    range: true,
    jump: false,
});

export const Queen: AbstractPiece = Object.freeze({
    type: TypeQueen,
    value: 9,
    range: true,
    jump: false,
});

export const King: AbstractPiece = Object.freeze({
    type: TypeKing,
    value: 1000,
    range: false,
    jump: false,
});

export const WhitePawn: Piece = Object.freeze({
    ...Pawn,
    color: Color.White,
    letter: "P",
    moves: [Move.WhitePawnAdvance, Move.WhitePawnCapture],
});

export const BlackPawn: Piece = Object.freeze({
    ...Pawn,
    color: Color.Black,
    letter: "p",
    moves: [Move.BlackPawnAdvance, Move.BlackPawnCapture],
});

export const WhiteKnight: Piece = Object.freeze({
    ...Knight,
    color: Color.White,
    letter: "N",
    moves: [Move.Knight],
});

export const BlackKnight: Piece = Object.freeze({
    ...Knight,
    color: Color.Black,
    letter: "n",
    moves: [Move.Knight],
});

export const WhiteBishop: Piece = Object.freeze({
    ...Bishop,
    color: Color.White,
    letter: "B",
    moves: [Move.Bishop],
});

export const BlackBishop: Piece = Object.freeze({
    ...Bishop,
    color: Color.Black,
    letter: "b",
    moves: [Move.Bishop],
});

export const WhiteRook: Piece = Object.freeze({
    ...Rook,
    color: Color.White,
    letter: "R",
    moves: [Move.Rook],
});

export const BlackRook: Piece = Object.freeze({
    ...Rook,
    color: Color.Black,
    letter: "r",
    moves: [Move.Rook],
});

export const WhiteQueen: Piece = Object.freeze({
    ...Queen,
    color: Color.White,
    letter: "Q",
    moves: [Move.Queen],
});

export const BlackQueen: Piece = Object.freeze({
    ...Queen,
    color: Color.Black,
    letter: "q",
    moves: [Move.Queen],
});

export const WhiteKing: Piece = Object.freeze({
    ...King,
    color: Color.White,
    letter: "K",
    moves: [Move.King],
});

export const BlackKing: Piece = Object.freeze({
    ...King,
    color: Color.Black,
    letter: "k",
    moves: [Move.King],
});


const wp = WhitePawn;
const bp = BlackPawn;
const wn = WhiteKnight;
const bn = BlackKnight;
const wb = WhiteBishop;
const bb = BlackBishop;
const wr = WhiteRook;
const br = BlackRook;
const wq = WhiteQueen;
const bq = BlackQueen;
const wk = WhiteKing;
const bk = BlackKing;

const w = Color.White;
const b = Color.Black;


const list: {[key: string]: Piece[]} = {
    [w]: [wp, wn, wb, wr, wq ,wk],
    [b]: [bp, bn, bb, br, bq, bk],
};

const map: {[key: string]: Piece} = [...list[w], ...list[b]].reduce(
    (map, piece) => ({...map, [piece.letter]: piece}),
    {},
);

export function getByColor(color: string): Piece[] {
    return list[color];
}

export function getByType(type: number, color: string): Piece {
    let idx = list[color].findIndex(piece => piece.type === type);
    return list[color][idx];
}

export function get(letter: string): Piece {
    return map[letter];
}
