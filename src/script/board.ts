import { Setup } from './board-const.js';

// TODO: Refactor
// - Rename to chess
// - Backend only, no concern about board/visual representation
// - Use interfaces

// 0-based rank, 0-based file chessboard
export default class Board {
    
    public static readonly size = 8;
    public static readonly fileLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

    private data: string[][];

    public constructor() {
        this.data = new Array(Board.size);
        
        for(let rank = 0; rank < Board.size; rank++) {
            this.data[rank] = new Array(Board.size);
            for (let file = 0; file < Board.size; file++) {
                this.data[rank][file] = Setup[rank].charAt(file);
            }
        }
    }

    public getPosition(): string[][] {
        let board = new Array(Board.size);

        for(let rank = 0; rank < Board.size; rank++) {
            board[rank] = new Array(Board.size);
            for (let file = 0; file < Board.size; file++) {
                board[rank][file] = this.data[rank][file];
            }
        }
        return board;
    }
}