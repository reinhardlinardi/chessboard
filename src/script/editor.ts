import * as Castle from './castle.js';
import { Board, getPiece, setPiece } from './board.js';

export function hasCastlePosition(board: Board, type: string) {
    const castle = Castle.get(type);
    const king = castle.king;
    const rook = castle.rook;

    return getPiece(board, king.square.rank, king.square.file) === king.piece &&
        getPiece(board, rook.square.rank, rook.square.file) === rook.piece;
}