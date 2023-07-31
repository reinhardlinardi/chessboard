export type Board = string[][];

export function getPiece(board: Board, rank: number, file: number) {
    return board[rank-1][file-1];
}

export function setPiece(board: Board, rank: number, file: number, piece: string) {
    board[rank-1][file-1] = piece;
}