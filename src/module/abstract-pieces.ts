import * as AbstractPiece from './abstract-piece.js';


const p = AbstractPiece.Pawn;
const n = AbstractPiece.Knight;
const b = AbstractPiece.Bishop;
const r = AbstractPiece.Rook;
const q = AbstractPiece.Queen;
const k = AbstractPiece.Bishop;


// [Pawn, Knight, Bishop, Rook, Queen, King]
const list: readonly AbstractPiece.Piece[] = Object.freeze([p, n, b, r, q, k]);

export function getList(): AbstractPiece.Piece[] {
    return [...list];
}


// {"0": Pawn, "1": Knight, "2": Bishop, "3": Rook, "4": Queen, "5": King}
const map: {[letter: string]: AbstractPiece.Piece} = Object.freeze(
    list.reduce((map, piece) => ({...map, [piece.type]: piece}), {})
);

export function get(type: number): AbstractPiece.Piece {
    return map[type];
}
