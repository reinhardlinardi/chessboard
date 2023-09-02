import * as AbstractPiece from './abstract-piece.js';
import * as PieceMove from './piece-move.js';
import { Color, Black, White } from './color.js';


export const None: string = " ";


export interface Piece extends AbstractPiece.Piece {
    color: Color,
    letter: string,
    moves: PieceMove.Move[],
};

export const WhitePawn: Piece = Object.freeze({
    ...AbstractPiece.Pawn,
    color: White,
    letter: "P",
    moves: [PieceMove.WhitePawnAdvance, PieceMove.WhitePawnCapture],
});

export const BlackPawn: Piece = Object.freeze({
    ...AbstractPiece.Pawn,
    color: Black,
    letter: "p",
    moves: [PieceMove.BlackPawnAdvance, PieceMove.BlackPawnCapture],
});

export const WhiteKnight: Piece = Object.freeze({
    ...AbstractPiece.Knight,
    color: White,
    letter: "N",
    moves: [PieceMove.Knight],
});

export const BlackKnight: Piece = Object.freeze({
    ...AbstractPiece.Knight,
    color: Black,
    letter: "n",
    moves: [PieceMove.Knight],
});

export const WhiteBishop: Piece = Object.freeze({
    ...AbstractPiece.Bishop,
    color: White,
    letter: "B",
    moves: [PieceMove.Bishop],
});

export const BlackBishop: Piece = Object.freeze({
    ...AbstractPiece.Bishop,
    color: Black,
    letter: "b",
    moves: [PieceMove.Bishop],
});

export const WhiteRook: Piece = Object.freeze({
    ...AbstractPiece.Rook,
    color: White,
    letter: "R",
    moves: [PieceMove.Rook],
});

export const BlackRook: Piece = Object.freeze({
    ...AbstractPiece.Rook,
    color: Black,
    letter: "r",
    moves: [PieceMove.Rook],
});

export const WhiteQueen: Piece = Object.freeze({
    ...AbstractPiece.Queen,
    color: White,
    letter: "Q",
    moves: [PieceMove.Queen],
});

export const BlackQueen: Piece = Object.freeze({
    ...AbstractPiece.Queen,
    color: Black,
    letter: "q",
    moves: [PieceMove.Queen],
});

export const WhiteKing: Piece = Object.freeze({
    ...AbstractPiece.King,
    color: White,
    letter: "K",
    moves: [PieceMove.King],
});

export const BlackKing: Piece = Object.freeze({
    ...AbstractPiece.King,
    color: Black,
    letter: "k",
    moves: [PieceMove.King],
});
