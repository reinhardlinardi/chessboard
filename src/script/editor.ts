import * as Castle from './castle.js';
import * as Piece from './piece.js';
import * as Color from './color.js';
import * as Rank from './rank.js';
import * as Square from './square.js';
import { Position, get, set } from './position.js';


const P = Piece.WhitePawn.letter;
const p = Piece.BlackPawn.letter;

const w = Color.White;


export function hasCastlePosition(pos: Position, type: string) {
    const castle = Castle.get(type);
    const king = castle.king;
    const rook = castle.rook;

    return get(pos, king.square.rank, king.square.file) === king.piece &&
        get(pos, rook.square.rank, rook.square.file) === rook.piece;
}

export function getEnPassantTargets(pos: Position, color: string): Square.Square[] {
    const n: number = 5;
    
    const rank: number = Rank.nthRank(color, n);
    const playerPawn: string = (color == w)? P : p;
    const oppPawn: string = (color == w)? p : P;

    let candidates: number[] = [];
    let targets: Square.Square[] = [];

    // For each file, check in this rank if there is opponent pawn
    for(let file = 1; file <= 8; file++) {
        if(get(pos, rank, file) === oppPawn) candidates.push(file);
    }

   // For each candidate file in this rank, check adjacent files
   // If in either adjacent files our pawn is present, then we can confirm en passant target on candidate file
    for(const file of candidates) {
        const left = file-1;
        const right = file+1;

        const hasLeft = (left >= 1 && get(pos, rank, left) == playerPawn);
        const hasRight = (right <= 8 && get(pos, rank, right) == playerPawn);

        if(hasLeft || hasRight) {
            targets.push({rank: Rank.nthRank(color, n+1), file: file});
        };
    }

    return targets;
}