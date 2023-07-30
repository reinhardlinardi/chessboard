import * as Color from './color.js';

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
    // TODO: move
};

export interface Piece extends AbstractPiece {
    color: string,
    letter: string,
};

export const Pawn: AbstractPiece = {
    type: TypePawn,
    value: 1,
};

export const Knight: AbstractPiece = {
    type: TypeKnight,
    value: 3,
};

export const Bishop: AbstractPiece = {
    type: TypeBishop,
    value: 3,
};

export const Rook: AbstractPiece = {
    type: TypeRook,
    value: 5,
};

export const Queen: AbstractPiece = {
    type: TypeQueen,
    value: 9,
};

export const King: AbstractPiece = {
    type: TypeKing,
    value: 1000,
};

export const WhitePawn: Piece = {
    ...Pawn,
    color: Color.White,
    letter: "P",
};

export const BlackPawn: Piece = {
    ...Pawn,
    color: Color.Black,
    letter: "p",
};

export const WhiteKnight: Piece = {
    ...Knight,
    color: Color.White,
    letter: "N",
};

export const BlackKnight: Piece = {
    ...Knight,
    color: Color.Black,
    letter: "n",
};

export const WhiteBishop: Piece = {
    ...Bishop,
    color: Color.White,
    letter: "B",
};

export const BlackBishop: Piece = {
    ...Bishop,
    color: Color.Black,
    letter: "b",
};

export const WhiteRook: Piece = {
    ...Rook,
    color: Color.White,
    letter: "R",
};

export const BlackRook: Piece = {
    ...Rook,
    color: Color.Black,
    letter: "r",
};

export const WhiteQueen: Piece = {
    ...Queen,
    color: Color.White,
    letter: "Q",
};

export const BlackQueen: Piece = {
    ...Queen,
    color: Color.Black,
    letter: "q",
};

export const WhiteKing: Piece = {
    ...King,
    color: Color.White,
    letter: "K",
};

export const BlackKing: Piece = {
    ...King,
    color: Color.Black,
    letter: "k",
};


const wp: Piece = WhitePawn;
const bp: Piece = BlackPawn;
const wn: Piece = WhiteKnight;
const bn: Piece = BlackKnight;
const wb: Piece = WhiteBishop;
const bb: Piece = BlackBishop;
const wr: Piece = WhiteRook;
const br: Piece = BlackRook;
const wq: Piece = WhiteQueen;
const bq: Piece = BlackQueen;
const wk: Piece = WhiteKing;
const bk: Piece = BlackKing;

const w: string = Color.White;
const b: string = Color.Black;


const list: {[key: string]: Piece[]} = {
    [Color.White]: [wp, wn, wb, wr, wq ,wk],
    [Color.Black]: [bp, bn, bb, br, bq, bk],
};

const map: {[key: string]: Piece} = [...list[w], ...list[b]].reduce(
    (map, piece) => ({...map, [piece.letter]: piece}),
    {},
);

export function getTypes(color: string): Piece[] {
    return list[color];
};

export function get(letter: string): Piece {
    return map[letter];
};
