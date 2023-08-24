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


// [Pawn, Knight, Bishop, Rook, Queen, King]
const list: readonly Piece[] = Object.freeze([Pawn, Knight, Bishop, Rook, Queen, King]);

export function getList(): Piece[] {
    return [...list];
}


// {"0": Pawn, "1": Knight, "2": Bishop, "3": Rook, "4": Queen, "5": King}
const map: {[letter: string]: Piece} = Object.freeze(
    list.reduce((map, piece) => ({...map, [piece.type]: piece}), {})
);

export function get(type: number): Piece {
    return map[type];
}
