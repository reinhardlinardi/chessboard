import * as Castle from './castle.js';
import * as Piece from './piece.js';
import { Position, get } from './position.js';
import { Color, opponentOf } from './color.js';
import { nthRank } from './rank.js';
import { Square } from './square.js';


export function hasCastlePosition(type: Castle.Type, pos: Position): boolean {
    const castle = Castle.get(type);
    
    const king = castle.king;
    const rook = castle.rook;

    return get(pos, king.from.rank, king.from.file) === king.piece &&
        get(pos, rook.from.rank, rook.from.file) === rook.piece;
}


function pawnFilter(color: Color): Piece.Filter[] {
    return [Piece.typeFilter(Piece.TypePawn), Piece.colorFilter(color)];
}

export function getEnPassantTargets(color: Color, pos: Position): Square[] {
    const n: number = 5;
    const rank = nthRank(n, color);

    const opponent = opponentOf(color);

    const playerPawn = Piece.filterBy(...pawnFilter(color))[0].letter;
    const opponentPawn = Piece.filterBy(...pawnFilter(opponent))[0].letter;

    let candidates: number[] = [];
    let targets: Square[] = [];

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
