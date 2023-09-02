import * as Piece from './piece.js';
import * as File from './file.js';
import * as Loc from './location.js';
import * as PieceType from './piece-type.js';
import { nthRank } from './rank.js';
import { Color, White, Black } from './color.js';
import { Direction, Kingside, Queenside } from './direction.js';


export type Type = string;
export type Rights = {[type: Type]: boolean};


export const TypeShort: Type = "O-O";
export const TypeLong: Type = "O-O-O";


export interface Move {
    piece: string,
    from: Loc.Location,
    direction: Direction,
    squares: number,
};

export interface Castle {
    type: Type,
    color: Color,
    letter: string,
    king: Move,
    rook: Move,
};


const king = PieceType.TypeKing;
const rook = PieceType.TypeRook;

const short = TypeShort;
const long = TypeLong;

// {"w": {"3": "R", "5": "K"}, "b": {"3": "r", "5": "k"}}
const piece = Object.freeze({
    [White]: {[king]: Piece.WhiteKing.letter, [rook]: Piece.WhiteRook.letter},
    [Black]: {[king]: Piece.BlackKing.letter, [rook]: Piece.BlackRook.letter},
});

// {"3": {"O-O": "h", "O-O-O": "a"}, "5": {"O-O": "e", "O-O-O": "e"}}
const pieceFile = Object.freeze({
    [king]: {[short]: File.e, [long]: File.e},
    [rook]: {[short]: File.h, [long]: File.a},
});

// {"3": {"O-O": -1, "O-O-O": 1}, "5": {"O-O": 1, "O-O-O": -1}}
const directions = Object.freeze({
    [king]: {[short]: Kingside, [long]: Queenside},
    [rook]: {[short]: Queenside, [long]: Kingside},
});

// {"3": {"O-O": 2, "O-O-O": 3}, "5": {"O-O": 2, "O-O-O": 2}}
const squares = Object.freeze({
    [king]: {[short]: 2, [long]: 2},
    [rook]: {[short]: 2, [long]: 3},
});


export const WhiteShort: Castle = Object.freeze({
    type: short,
    color: White,
    letter: Piece.WhiteKing.letter,
    king: castleMoveOf(king, White, short),
    rook: castleMoveOf(rook, White, short),
});

export const BlackShort: Castle = Object.freeze({
    type: short,
    color: Black,
    letter: Piece.BlackKing.letter,
    king: castleMoveOf(king, Black, short),
    rook: castleMoveOf(rook, Black, short),
});

export const WhiteLong: Castle = Object.freeze({
    type: long,
    color: White,
    letter: Piece.WhiteQueen.letter,
    king: castleMoveOf(king, White, long),
    rook: castleMoveOf(rook, White, long),
});

export const BlackLong: Castle = Object.freeze({
    type: long,
    color: Black,
    letter: Piece.BlackQueen.letter,
    king: castleMoveOf(king, Black, long),
    rook: castleMoveOf(rook, Black, long),
});

function castleMoveOf(pieceType: PieceType.Type, color: Color, type: Type): Move {
    const file = pieceFile[pieceType][type];
    const rank = nthRank(1, color);

    return {
        piece: piece[color][pieceType],
        from: Loc.of(file, rank),
        direction: directions[pieceType][type],
        squares: squares[pieceType][type],
    };
}
