import * as Loc from './location.js';
import * as Piece from './piece.js';
import * as PieceMove from './piece-move.js';
import * as Castle from './castle.js';
import * as EnPassant from './en-passant.js';
import * as Attack from './attack.js';
import * as Pieces from './pieces.js';
import * as Castles from './castles.js';
import { State } from './state.js';
import { Size as size } from './size.js';
import { Color, opponentOf } from './color.js';
import { Position, getByLoc } from './position.js';
import { nthRank } from './rank.js';
import { getEnPassantPawns, getKingLoc, outOfBound } from './position-util.js';
import { TypeRange } from './piece-move.js';
import { TypeKing, TypePawn } from './piece-type.js';


type Location = Loc.Location;
type Attacks = Attack.Attacks;
type Pin = Attack.Pin;

export type Moves = {[loc: Location]: Location[]};


export function getLegalMoves(s: State): Moves {
    const attacks = Attack.attacksOn(s.move, s.pos);
    const pin = Attack.pinnedPiecesOf(s.move, s.pos, attacks);
    const indirectPinned = Attack.isEnPassantIndirectPinned(s.enPassant, s.move, s.pos);

    // const inCheck = Attack.isKingAttacked(s.move, s.pos, attacks);
    const moves = generateMoves(s);

    // Removes king moves that put self in check
    removeKingMoves(moves, s.pos, s.move, attacks);

    // Remove illegal moves for pieces pinned to the king
    removePinnedPiecesMoves(moves, s.pos, s.move, pin);
    
    // Remove en passant move if indirectly pinned
    removeEnPassantMove(moves, s.pos, s.move, s.enPassant, indirectPinned);

    // Remove castle moves if in check or any square in king's path is attacked
    // removeCastleMoves(moves, s.move, attacks);

    console.log(JSON.stringify(moves));
    // If in check, select moves that put king out of check
    // if(inCheck) // TODO: implement

    return moves;
}


function generateMoves(s: State): Moves {
    const ordinary = generatePieceMoves(s.pos, s.move);
    const special = generateSpecialMoves(s.pos, s.move, s.castle, s.enPassant);
    return mergeMoves(ordinary, special);
}

function generatePieceMoves(pos: Position, color: Color): Moves {
    let moves: Moves = {};

    for(let rank = 1; rank <= size; rank++) {
        for(let file = 1; file <= size; file++) {
            const loc = Loc.of(file, rank);

            const subject = getByLoc(pos, loc);
            if(subject === Piece.None) continue;

            const piece = Pieces.get(subject);
            if(piece.color !== color) continue;
            
            const getMovesFn = piece.attack === TypeRange? getRangeMoves : getDirectMoves;
            moves[loc] = getMovesFn(pos, loc, color);
        }
    }

    return moves;
}

function generateSpecialMoves(pos: Position, color: Color, rights: Castle.Rights, enPassant: Location): Moves {
    return {...getTwoRankPawnMoves(pos, color), ...getCastleMoves(pos, rights, color),
        ...getEnPassantMove(pos, enPassant, color)};
}

function getDirectMoves(pos: Position, loc: Location, color: Color): Location[] {
    let moves: Location[] = [];
    
    const opponent = opponentOf(color);
    const piece = Pieces.get(getByLoc(pos, loc));

    for(const move of piece.moves) {
        for(const direction of move.directions) {
            const square = loc + direction;

            if(outOfBound(square)) continue;
            if(canOccupy(square, pos, move, opponent)) moves.push(square);
        }
    }

    return moves;
}

function getRangeMoves(pos: Position, loc: Location, color: Color): Location[] {
    let moves: Location[] = [];

    const opponent = opponentOf(color);
    const piece = Pieces.get(getByLoc(pos, loc));

    for(const move of piece.moves) {
        for(const direction of move.directions) {
            let square = loc;

            while(!outOfBound(square += direction)) {
                if(canOccupy(square, pos, move, opponent)) moves.push(square);
                if(getByLoc(pos, square) !== Piece.None) break;
            }
        }
    }

    return moves;
}

function getTwoRankPawnMoves(pos: Position, color: Color): Moves {
    let moves: Moves = {};

    const n = 2;
    const rank = nthRank(n, color);

    for(let file = 1; file <= size; file++) {
        const loc = Loc.of(file, rank)

        const subject = getByLoc(pos, loc);
        if(subject === Piece.None) continue;

        const piece = Pieces.get(subject);
        if(piece.color !== color || piece.type !== TypePawn) continue;

        const oneAhead = Loc.of(file, nthRank(n+1, color));
        const twoAhead = Loc.of(file, nthRank(n+2, color));
        if(canMoveTo(oneAhead, pos) && canMoveTo(twoAhead, pos)) moves[loc] = [twoAhead];
    }

    return moves;
}

function getCastleMoves(pos: Position, rights: Castle.Rights, color: Color): Moves {
    let moves: Moves = {};
    
    for(let type in rights) {
        if(!rights[type]) continue;

        const castle = Castles.get(type);
        const king = castle.king;
        const rook = castle.rook;

        if(castle.color !== color) continue;
        if(getByLoc(pos, king.from) !== king.piece) continue;
        if(getByLoc(pos, rook.from) !== rook.piece) continue;

        let clear = true;

        for(let loc = rook.from; loc != king.from; loc += rook.direction) {
            if(loc === rook.from) continue;
            if(getByLoc(pos, loc) !== Piece.None) clear = false;
        }
        if(clear) {
            if(!(king.from in moves)) moves[king.from] = [];
            moves[king.from].push(king.from + king.squares*king.direction);
        }
    }

    return moves;
}

function getEnPassantMove(pos: Position, target: Location, color: Color): Moves {
    if(target === Loc.None) return {};
    
    let moves: Moves = {};
    const file = Loc.file(target);
    const playerPawnsLoc = EnPassant.playerPawnsLoc(file, color);

    for(const loc of playerPawnsLoc) {
        if(getByLoc(pos, loc) !== Piece.None) moves[loc] = [target];
    }
    return moves;
}

function removeKingMoves(moves: Moves, pos: Position, color: Color, attacks: Attacks) {
    let remove: Location[] = [];

    const loc = getKingLoc(pos, color);
    const king = Pieces.get(getByLoc(pos, loc));
    const opponent = opponentOf(color);

    for(const move of king.moves) {
        for(const direction of move.directions) {
            const square = loc + direction;
            if(outOfBound(square)) continue;
            if(canOccupy(square, pos, move, opponent) && Attack.isAttacked(square, attacks)) remove.push(square);
        }
    }

    moves[loc] = moves[loc].filter(square => !remove.includes(square));
}

function removePinnedPiecesMoves(moves: Moves, pos: Position, color: Color, pin: Pin) {
    const opponent = opponentOf(color);

    for(const locStr in pin) {
        const loc = parseInt(locStr);
        const piece = Pieces.get(getByLoc(pos, loc));
        
        let legal: Location[] = [];
        let inLine: Location[] = [];
        const directions = [pin[loc], -1*pin[loc]];

        for(const direction of directions) {
            let move = piece.moves[0];
            let skip = true;

            for(const mv of piece.moves) {
                if(mv.directions.includes(direction)) {
                    skip = false;
                    move = mv;
                    break;
                }
            }

            if(skip) continue;
            let square = loc;
            
            while(true) {
                square += direction;
                if(canOccupy(square, pos, move, opponent)) inLine.push(square);
                if(getByLoc(pos, square) !== Piece.None) break;
            }
        }
        
        for(const dest of inLine) {
            if(moves[loc].includes(dest)) legal.push(dest);
        }
        moves[loc] = legal;
    }
}

function removeEnPassantMove(moves: Moves, pos: Position, color: Color, target: Location, indirectPinned: boolean) {
    if(!indirectPinned) return;
    
    const pawn = getEnPassantPawns(Loc.file(target), pos, color)[color][0];
    moves[pawn] = moves[pawn].filter(loc => loc !== target);
}

// function removeCastleMoves(moves: Moves, color: Color, attacks: Attacks) {
//     const list = Castles.getByColor(color);

//     for(const castle of list) {
//         const from = castle.king.from;
//         const direction = castle.king.direction;
//         const to = from + castle.king.squares * direction;

//         for(let loc = from; loc != to; loc += direction) {
//             if(Attack.isAttacked(loc, attacks)) {
//                 moves[from] = moves[from].filter(square => square !== to);
//                 break;
//             }
//         }
//     }
// }


function canOccupy(square: Location, pos: Position, move: PieceMove.Move, opponent: Color): boolean {
    if(move.move && canMoveTo(square, pos)) return true;
    if(move.capture && canCaptureOn(square, pos, opponent)) return true;
    return false;
}

function canMoveTo(square: Location, pos: Position): boolean {
    return getByLoc(pos, square) === Piece.None;
}

function canCaptureOn(square: Location, pos: Position, opponent: Color): boolean {
    const target = getByLoc(pos, square);
    if(target === Piece.None) return false;

    const piece = Pieces.get(target);
    return piece.color === opponent && piece.type !== TypeKing;
}

function mergeMoves(...moves: Moves[]): Moves {
    let res: Moves = {};

    for(const move of moves) {
        for(const square in move) {
            if(!(square in res)) res[square] = [];
            res[square].push(...move[square]);
        }
    }
    return res;
}
