export const enum Type {
    Pawn,
    Knight,
    Bishop,
    Rook,
    Queen,
    King,
};

export const None: string = ".";

export const enum Color {
    White,
    Black
};

export interface Piece {
    type: Type,
    value: number,
    color: Color,
    letter: string,
    // TODO: movetype
};

export const Pawn = {
    type: Type.Pawn,
    value: 1,
};

export const Knight = {
    type: Type.Knight,
    value: 3,
};

export const Bishop = {
    type: Type.Bishop,
    value: 3,
};

export const Rook = {
    type: Type.Rook,
    value: 5,
};

export const Queen = {
    type: Type.Queen,
    value: 9,
};

export const King = {
    type: Type.King,
    value: 1000,
};

export const WhitePawn: Piece = {
    ...Pawn,
    color: Color.White,
    letter: 'P',
};

export const BlackPawn: Piece = {
    ...Pawn,
    color: Color.Black,
    letter: 'p',
};

export const WhiteKnight: Piece = {
    ...Knight,
    color: Color.White,
    letter: 'N',
};

export const BlackKnight: Piece = {
    ...Knight,
    color: Color.Black,
    letter: 'n',
};

export const WhiteBishop: Piece = {
    ...Bishop,
    color: Color.White,
    letter: 'B',
};

export const BlackBishop: Piece = {
    ...Bishop,
    color: Color.Black,
    letter: 'b',
};

export const WhiteRook: Piece = {
    ...Rook,
    color: Color.White,
    letter: 'R',
};

export const BlackRook: Piece = {
    ...Rook,
    color: Color.Black,
    letter: 'r',
};

export const WhiteQueen: Piece = {
    ...Queen,
    color: Color.White,
    letter: 'Q',
};

export const BlackQueen: Piece = {
    ...Queen,
    color: Color.Black,
    letter: 'q',
};

export const WhiteKing: Piece = {
    ...King,
    color: Color.White,
    letter: 'K',
};

export const BlackKing: Piece = {
    ...King,
    color: Color.Black,
    letter: 'k',
};

const map: {[key: string]: Piece} = {
    'P': WhitePawn,
    'p': BlackPawn,
    'N': WhiteKnight,
    'n': BlackKnight,
    'B': WhiteBishop,
    'b': BlackBishop,
    'R': WhiteRook,
    'r': BlackRook,
    'Q': WhiteQueen,
    'q': BlackQueen,
    'K': WhiteKing,
    'k': BlackKing,
};

export function get(letter: string): Piece {
    return map[letter];
}


