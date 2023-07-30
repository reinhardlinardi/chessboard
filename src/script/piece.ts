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
}

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


const list: {[key: string]: Piece[]} = {
    [Color.White]: [WhitePawn, WhiteKnight, WhiteBishop, WhiteRook, WhiteQueen, WhiteKing],
    [Color.Black]: [BlackPawn, BlackKnight, BlackBishop, BlackRook, BlackQueen, BlackKing],
};

const map: {[key: string]: Piece} = [...list[Color.White], ...list[Color.Black]].reduce(
    (res, val) => ({...res, [val.letter]: val}),
    {},
);

export function getTypes(color: string): Piece[] {
    return list[color];
}

export function get(letter: string): Piece {
    return map[letter];
}




