import * as PieceType from './piece-type.js';
import * as PieceMove from './piece-move.js';


export interface Piece {
    type: PieceType.Type,
    value: number,
    attack: PieceMove.Type,
};

export const Pawn: Piece = Object.freeze({
    type: PieceType.TypePawn,
    value: 1,
    attack: PieceMove.TypeDirect,
});

export const Knight: Piece = Object.freeze({
    type: PieceType.TypeKnight,
    value: 3,
    attack: PieceMove.TypeDirect,
});

export const Bishop: Piece = Object.freeze({
    type: PieceType.TypeBishop,
    value: 3,
    attack: PieceMove.TypeRange,
});

export const Rook: Piece = Object.freeze({
    type: PieceType.TypeRook,
    value: 5,
    attack: PieceMove.TypeRange,
});

export const Queen: Piece = Object.freeze({
    type: PieceType.TypeQueen,
    value: 9,
    attack: PieceMove.TypeRange,
});

export const King: Piece = Object.freeze({
    type: PieceType.TypeKing,
    value: 1000,
    attack: PieceMove.TypeDirect,
});
