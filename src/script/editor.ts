import * as Castle from './castle.js';
import * as Piece from './piece.js';
import * as Color from './color.js';
import * as Square from './square.js';
import { Position, get, set } from './position.js';
import { nthRank } from './rank.js';
 

const P = Piece.WhitePawn.letter;
const p = Piece.BlackPawn.letter;

const w = Color.White;


export function hasCastlePosition(type: string, pos: Position) {
    const castle = Castle.get(type);
    
    const king = castle.king;
    const rook = castle.rook;
    const kingSquare = king.from;
    const rookSquare = rook.from;

    return get(pos, kingSquare.rank, kingSquare.file) === king.piece &&
        get(pos, rookSquare.rank, rookSquare.file) === rook.piece;
}

export function getEnPassantTargets(color: string, pos: Position): Square.Square[] {
    const n: number = 5;
    const rank: number = nthRank(n, color);

    const type = Piece.TypePawn;
    const opposite = Color.opposite(color);
        
    const playerPawn: string = Piece.getByType(type, color).letter;
    const opponentPawn: string = Piece.getByType(type, opposite).letter;

    let candidates: number[] = [];
    let targets: Square.Square[] = [];

    // For each file in rank, push file as candidate if there is opponent pawn
    for(let file = 1; file <= 8; file++) {
        if(get(pos, rank, file) === opponentPawn) candidates.push(file);
    }

   // For each candidate file in rank, check adjacent files
   // If in either adjacent files player pawn is present, then pawn is en passant target
    for(const file of candidates) {
        const left = file-1;
        const right = file+1;

        const hasLeft = (left >= 1 && get(pos, rank, left) == playerPawn);
        const hasRight = (right <= 8 && get(pos, rank, right) == playerPawn);

        if(hasLeft || hasRight) {
            targets.push({rank: nthRank(n+1, color), file: file});
        }
    }

    return targets;
}