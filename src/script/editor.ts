import * as Castle from './castle.js';
import { Board } from './type.js';


export function hasCastlePosition(board: Board, type: string) {
    let castle = Castle.get(type);
    let king = castle.king;
    let rook = castle.rook;

    return board[king.square.rank-1][king.square.file-1] === king.piece &&
        board[rook.square.rank-1][rook.square.file-1] === rook.piece;
}