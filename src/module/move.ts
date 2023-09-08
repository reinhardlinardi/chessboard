import * as Loc from './location.js';
import * as Piece from './piece.js';
import * as Castle from './castle.js';
import * as Attack from './attack.js';
import * as Pieces from './pieces.js';
import * as Castles from './castles.js';
import { State } from './state.js';
import { Size as size } from './size.js';
import { Color, opponentOf } from './color.js';
import { Position, getByLoc } from './position.js';
import { nthRank } from './rank.js';
import { Move, TypeRange } from './piece-move.js';
import { TypeKing, TypePawn } from './piece-type.js';
import { isEnPassantResultInCheck } from './game-util.js';
import { getEnPassantPawns, getKingLoc, outOfBound } from './position-util.js';


type Location = Loc.Location;
type Attacks = Attack.Attacks;
type Pin = Attack.Pin;

export type Moves = {[loc: Location]: Location[]};


export function getLegalMoves(s: State): Moves {
    const attacks = Attack.attacksOn(s.move, s.pos);
    const pin = Attack.pinnedPiecesOf(s.move, s.pos, attacks);

    let moves = generateMoves(s);

    // 1. Removes king moves that put self in check
    removeKingMoves(moves, s.pos, s.move, attacks);

    // 2. Remove illegal moves for pieces pinned to the king
    removePinnedPiecesMoves(moves, s.pos, s.move, attacks, pin);
    
    // 3. Remove en passant move if en passant put self in check
    removeEnPassantMove(moves, s.pos, s.move, s.enPassant);

    // 4. Remove castle moves if in check or any square in king's path is attacked
    removeCastleMoves(moves, s.move, s.castle, attacks);

    // 5. If in check, select moves that put king out of check
    const inCheck = Attack.isKingAttacked(s.move, s.pos, attacks);
    if(inCheck) selectOutOfCheckMoves(moves, s.pos, s.move, s.enPassant, attacks);
    
    return moves;
}

export function hasLegalMoves(moves: Moves): boolean {
    for(const loc in moves) {
        if(moves[loc].length !== 0) return true;
    }
    return false;
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
        for(let loc = rook.from + rook.direction; loc !== king.from; loc += rook.direction) {
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
    const playerPawns = getEnPassantPawns(Loc.file(target), pos, color)[color];

    for(const loc of playerPawns) moves[loc] = [target];
    return moves;
}

function removeKingMoves(moves: Moves, pos: Position, color: Color, attacks: Attacks) {
    let remove: Location[] = [];

    const loc = getKingLoc(pos, color);
    const king = Pieces.get(getByLoc(pos, loc));

    for(const move of king.moves) {
        for(const direction of move.directions) {
            const square = loc + direction;
            if(outOfBound(square)) continue;
            if(Attack.isAttacked(square, attacks)) remove.push(square);
        }
    }

    moves[loc] = moves[loc].filter(square => !remove.includes(square));
}

function removePinnedPiecesMoves(moves: Moves, pos: Position, color: Color, attacks: Attacks, pin: Pin) {
    const kingLoc = getKingLoc(pos, color);

    for(const pinnedStr in pin) {
        const pinnedLoc = parseInt(pinnedStr);
        const pinnedFrom = pin[pinnedLoc];

        const attackers = attacks[pinnedLoc];
        const attackerLoc = parseInt(Object.keys(attackers).filter(loc => attackers[parseInt(loc)] === pinnedFrom)[0]);

        let inLine: Location[] = [];
        const directions = [pinnedFrom, -pinnedFrom];

        for(const direction of directions) {
            const start = pinnedLoc + direction;
            const end = (direction === pinnedFrom? attackerLoc : kingLoc) + direction;

            for(let square = start; square !== end; square += direction) inLine.push(square);
        }
        
        moves[pinnedLoc] = moves[pinnedLoc].filter(loc => inLine.includes(loc));
    }
}

function removeEnPassantMove(moves: Moves, pos: Position, color: Color, target: Location) {
    if(target === Loc.None) return;

    const pawns = getEnPassantPawns(Loc.file(target), pos, color)[color];
    for(const pawn of pawns) {
        const resultInCheck = isEnPassantResultInCheck(pos, color, target, pawn);
        if(resultInCheck) moves[pawn] = moves[pawn].filter(loc => loc !== target);
    }
}

function removeCastleMoves(moves: Moves, color: Color, rights: Castle.Rights, attacks: Attacks) {
    for(const type in rights) {
        const castle = Castles.get(type);

        if(castle.color !== color) continue;
        if(!rights[type]) continue;

        const from = castle.king.from;
        const direction = castle.king.direction;
        const to = from + castle.king.squares * direction;

        for(let loc = from; loc !== to + direction; loc += direction) {
            if(Attack.isAttacked(loc, attacks)) {
                moves[from] = moves[from].filter(square => square !== to);
                break;
            }
        }
    }
}

function selectOutOfCheckMoves(moves: Moves, pos: Position, color: Color, enPassant: Location, attacks: Attacks) {
    const opponent = opponentOf(color);
    const opponentAttacks = Attack.attacksOn(opponent, pos);
 
    let legal = mergeMoves(
        getOutOfCheckKingMoves(moves, pos, color, attacks),
        getCaptureCheckingPieceMoves(moves, pos, color, enPassant, attacks, opponentAttacks),
        getBlockCheckMoves(moves, pos, color, attacks, opponentAttacks),
    ); 

    for(const square in moves) {
        if(!(square in legal)) moves[square] = [];
        else moves[square] = legal[square];
    }
}

function getOutOfCheckKingMoves(moves: Moves, pos: Position, color: Color, attacks: Attacks): Moves {
    let legal: Moves = {};

    const kingLoc = getKingLoc(pos, color);
    legal[kingLoc] = [...moves[kingLoc]];
    
    const kingAttacks = attacks[kingLoc];
    const king = Pieces.getBy(color, TypeKing);

    for(const attackerLocStr in kingAttacks) {
        const attackerLoc = parseInt(attackerLocStr);

        const attacker = Pieces.get(getByLoc(pos, attackerLoc));
        if(attacker.attack !== TypeRange) continue;

        const shadowed = kingLoc + -kingAttacks[attackerLoc];

        for(const move of king.moves) {
            for(const direction of move.directions) {
                const loc = kingLoc + direction;
                if(loc === shadowed) {
                    legal[kingLoc] = legal[kingLoc].filter(dest => dest !== loc);
                    break;
                }
            }
        }
    }

    return legal;
}

function getCaptureCheckingPieceMoves(moves: Moves, pos: Position, color: Color, enPassant: Location, attacks: Attacks, opponentAttacks: Attacks): Moves {
    const numAttackers = Attack.numKingAttackersOf(color, pos, attacks);
    if(numAttackers > 1) return {};
    
    let legal: Moves = {};

    const kingLoc = getKingLoc(pos, color);
    const attackerLoc = parseInt(Object.keys(attacks[kingLoc])[0]);
    const pieces = opponentAttacks[attackerLoc];

    for(const pieceLoc in pieces) {
        if(!moves[pieceLoc].includes(attackerLoc)) continue;

        if(!(pieceLoc in legal)) legal[pieceLoc] = [];
        legal[pieceLoc].push(attackerLoc);
    }

    if(enPassant !== Loc.None) {
        const opponent = opponentOf(color);
        const pawns = getEnPassantPawns(Loc.file(attackerLoc), pos, color);

        if(attackerLoc === pawns[opponent][0]) {
            for(const pawnLoc of pawns[color]) {
                if(moves[pawnLoc].includes(enPassant)) legal[pawnLoc] = [enPassant];
            }
        }
    }

    return legal;
}

function getBlockCheckMoves(moves: Moves, pos: Position, color: Color, attacks: Attacks, opponentAttacks: Attacks): Moves {
    const numAttackers = Attack.numKingAttackersOf(color, pos, attacks);
    if(numAttackers > 1) return {};

    const kingLoc = getKingLoc(pos, color);
    const attackerLoc = parseInt(Object.keys(attacks[kingLoc])[0]);
    
    const attacker = Pieces.get(getByLoc(pos, attackerLoc));
    if(attacker.attack !== TypeRange) return {};
    
    let legal: Moves = {};
    let pawns: Location[] = [];

    const playerPawn = Pieces.getBy(color, TypePawn).letter;
    for(const pawnLocStr in moves) {
        const pawnLoc = parseInt(pawnLocStr);
        if(getByLoc(pos, pawnLoc) === playerPawn) pawns.push(pawnLoc);
    }

    const direction = attacks[kingLoc][attackerLoc];

    for(let loc = kingLoc + direction; loc !== attackerLoc; loc += direction) {
        const pieces = opponentAttacks[loc];
        
        for(const pieceLoc in pieces) {
            if(!moves[pieceLoc].includes(loc)) continue;

            if(!(pieceLoc in legal)) legal[pieceLoc] = [];
            legal[pieceLoc].push(loc);
        }
        for(const pawnLoc of pawns) {
            if(moves[pawnLoc].includes(loc)) legal[pawnLoc] = [loc];
        }
    }

    return legal;
}

function canOccupy(square: Location, pos: Position, move: Move, opponent: Color): boolean {
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
            for(const loc of move[square]) {
                if(!res[square].includes(loc)) res[square].push(loc);
            }
        }
    }
    return res;
}
