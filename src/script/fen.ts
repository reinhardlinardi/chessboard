import { Position, get, set } from './position.js';
import { Clock } from './clock.js';
import * as Piece from './piece.js';


export function Generate(pos: Position, move: string, castle: string[], enPassant: string, clock: Clock): string {
    let rows: string[] = new Array(8);

    // Piece placement
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

    const fen = [rows.join("/"), move, castle.join(""), enPassant, clock.halfmove, clock.fullmove];
    
    // For castle rights and en passant, value is "-" if not available
    for(let idx of [2, 3]) {
        if(fen[idx] === "") fen[idx] = "-";
    }
    
    return fen.join(" ");
}
