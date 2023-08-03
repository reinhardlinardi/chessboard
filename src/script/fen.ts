import { Position, get, set } from './position.js';
import * as Piece from './piece.js';

export function Generate(pos: Position, move: string, castleTypes: string[], enPassant: string): string {
    let rows: string[] = new Array(8);

    for(let rank = 8; rank >= 1; rank--) {
        let row: string = "";
        let cnt: number = 0;

        for(let file = 1; file <= 8; file++) {
            const piece = get(pos, rank, file);
            
            if(piece === Piece.None) cnt++;
            if(cnt > 0 && (piece !== Piece.None || file === 8)) {
                row += `${cnt}`;
                cnt = 0;
            }
            if(piece !== Piece.None) row += piece;
        }

        rows[8-rank] = row;
    }

    return rows.join("/");
    // move, castling, en passant, halfmove, fullmove
    // castling if "" return "-"
}