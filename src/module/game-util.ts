import * as Loc from './location.js';
import * as Piece from './piece.js';
import * as Pieces from './pieces.js';
import * as Castle from './castle.js';
import * as Castles from './castles.js';
import * as EnPassant from './en-passant.js';
import * as Promotion from './promotion.js';
import * as Attack from './attack.js';
import { Position, getByLoc, copy, setByLoc } from './position.js';
import { getEnPassantPawns } from './position-util.js';
import { TypePawn, TypeKing } from './piece-type.js';
import { Color, getList as getColors, opponentOf } from './color.js';
import { Moves } from './move.js';


type Location = Loc.Location;


export function isValidMove(from: Location, to: Location, moves: Moves): boolean {
    return from in moves && moves[from].includes(to);
}

export function isPawnMove(pos: Position, loc: Location): boolean {
    return Pieces.get(getByLoc(pos, loc)).type === TypePawn;
}

export function isKingMove(pos: Position, loc: Location): boolean {
    return Pieces.get(getByLoc(pos, loc)).type === TypeKing;
}

export function isCaptureMove(pos: Position, to: Location): boolean {
    return getByLoc(pos, to) !== Piece.None;
}

export function isCastleMove(pos: Position, from: Location, to: Location, color: Color): boolean {
    if(!isKingMove(pos, from)) return false;

    const castle = Castles.getByColor(color);
    const kingFrom = castle.map(c => c.king.from);
    const kingTo = castle.map(c => c.king.from + c.king.squares * c.king.direction);

    for(let idx = 0; idx <= castle.length; idx++) {
        if(from === kingFrom[idx] && to === kingTo[idx]) return true;
    }
    return false;
}

export function isEnPassantMove(pos: Position, from: Location, to: Location, player: Color, enPassant: Location): boolean {
    if(!isPawnMove(pos, from)) return false;
    if(to !== enPassant) return false;

    const file = Loc.file(to);
    const pawnLoc = EnPassant.playerPawnsLoc(file, player);

    for(const loc of pawnLoc) {
        if(from === loc) return true;
    }
    return false;
}

export function isPromotion(pos: Position, color: Color, from: Location, to: Location): boolean {
    const rank = Loc.rank(to);
    const promoteRank = Promotion.promoteRank(color);

    return isPawnMove(pos, from) && rank === promoteRank;
}

export function isCastleAllowed(type: string, rights: Castle.Rights, pos: Position): boolean {
    if(!rights[type]) return false;

    const c = Castles.get(type);
    const kingMoved = getByLoc(pos, c.king.from) !== c.king.piece;
    const rookMoved = getByLoc(pos, c.rook.from) !== c.rook.piece;

    return !kingMoved && !rookMoved;
}

export function isValidEnPassantTarget(target: Location, player: Color, pos: Position): boolean {
    // Validation:
    // 1. Target is present
    if(target === Loc.None) return false;
    
    const file = Loc.file(target);
    const opponentFromLoc = EnPassant.opponentPawnFromLoc(file, player);

    // 2. No pieces in opponent pawn's move path
    if(getByLoc(pos, opponentFromLoc) !== Piece.None) return false;
    if(getByLoc(pos, target) !== Piece.None) return false;

    // 3. Pawn positions are correct
    const colors = getColors();
    const pawns = getEnPassantPawns(file, pos, player);

    for(const color of colors) {
        if(pawns[color].length === 0) return false;
    }
    return true;
}

export function getEnPassantTargetFor(color: Color, pos: Position, from: Location, to: Location): Location {
    if(!isPawnMove(pos, to)) return Loc.None;

    const fromRank = EnPassant.fromRank(color);
    const toRank = EnPassant.pawnRank(color);
    if(fromRank !== Loc.rank(from) || toRank !== Loc.rank(to)) return Loc.None;

    const file = Loc.file(to);
    const target = EnPassant.targetLoc(file, color);

    const pawns = getEnPassantPawns(file, pos, color);
    const opponentPawn = Pieces.getBy(color, TypePawn).letter;

    for(const loc of pawns[color]) {
        if(getByLoc(pos, loc) === opponentPawn) return target;
    }
    return Loc.None;
}

export function isEnPassantResultInCheck(pos: Position, player: Color, target: Location, playerPawn: Location): boolean {
    const opponent = opponentOf(player);
    const captured = getEnPassantPawns(Loc.file(target), pos, player)[opponent][0];
    
    const after = copy(pos);

    setByLoc(getByLoc(pos, playerPawn), after, target);
    setByLoc(Piece.None, after, playerPawn);
    setByLoc(Piece.None, after, captured);

    const attacks = Attack.attacksOn(player, after);
    return Attack.isKingAttacked(player, after, attacks);
}
