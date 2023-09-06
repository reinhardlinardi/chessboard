import * as Loc from './location.js';
import * as Piece from './piece.js';
import * as Pieces from './pieces.js';
import * as Castle from './castle.js';
import * as Castles from './castles.js';
import * as EnPassant from './en-passant.js';
import * as Promotion from './promotion.js';
import { Position, getByLoc } from './position.js';
import { Color, getList as getColors, opponentOf } from './color.js';
import { getEnPassantPawns } from './position-util.js';
import { TypePawn } from './piece-type.js';
import { Moves } from './move.js';


type Location = Loc.Location;


export function isValidMove(from: Location, to: Location, moves: Moves): boolean {
    return from in moves && moves[from].includes(to);
}

export function isPawnMove(pos: Position, from: Location): boolean {
    return Pieces.get(getByLoc(pos, from)).type === TypePawn;
}

export function isCaptureMove(pos: Position, to: Location): boolean {
    return getByLoc(pos, to) !== Piece.None;
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
    if(target === Loc.None) return false;

    const file = Loc.file(target);
    const opponentFromLoc = EnPassant.opponentPawnFromLoc(file, player);

    if(getByLoc(pos, opponentFromLoc) !== Piece.None) return false;
    if(getByLoc(pos, target) !== Piece.None) return false;

    const colors = getColors();
    const pawns = getEnPassantPawns(file, pos, player);

    for(const color of colors) {
        if(pawns[color].length === 0) return false;
    }
    return true;
}

export function getEnPassantTarget(pos: Position, player: Color, from: Location, to: Location): Location {
    if(!isPawnMove(pos, from)) return Loc.None;

    const fromRank = EnPassant.fromRank(player);
    const toRank = EnPassant.pawnRank(player);
    if(fromRank !== Loc.rank(from) || toRank !== Loc.rank(to)) return Loc.None;

    const file = Loc.file(from);
    const opponent = opponentOf(player);
    const target = EnPassant.targetLoc(file, player);

    const pawns = getEnPassantPawns(file, pos, opponent);
    const opponentPawn = Pieces.getBy(opponent, TypePawn).letter;

    for(const loc of pawns[opponent]) {
        if(getByLoc(pos, loc) === opponentPawn) return target;
    }
    return Loc.None;
}
