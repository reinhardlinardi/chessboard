import * as Piece from './piece.js';
import { State } from './state.js';
import { get } from './position.js';


export function Generate(s: State): string {
    // Piece placement
    let rows: string[] = new Array(8);
    
    for(let rank = 8; rank >= 1; rank--) {
        let row: string = "";
        let cnt: number = 0;

        for(let file = 1; file <= 8; file++) {
            const piece = get(s.pos, rank, file);
            
            if(piece === Piece.None) cnt++;
            if(cnt > 0 && (piece !== Piece.None || file === 8)) {
                row += `${cnt}`;
                cnt = 0;
            }
            if(piece !== Piece.None) row += piece;
        }

        rows[8-rank] = row;
    }

    const placement: string = rows.join("/"); // e.g. rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR

    // Put all available castle types to array, then concat
    let castle: string = Object.keys(s.castle).filter(type => s.castle[type]).join(""); // e.g. "KQkq"
    if(castle === "") castle = "-";

    const enPassant: string = (s.enPassant === "")? "-" : s.enPassant;
    
    const parts: string[] = [placement, s.move, castle, enPassant, s.clock.halfmove.toString(), s.clock.fullmove.toString()];
    return parts.join(" ");
}
