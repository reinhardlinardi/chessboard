import * as Loc from './location.js';
import * as Piece from './piece.js';
import * as Castle from './castle.js';
import * as Castles from './castles.js';
import * as EnPassant from './en-passant.js';
import { Position, getByLoc } from './position.js';
import { Color, getList as getColors } from './color.js';
import { getEnPassantPawns } from './position-util.js';


type Location = Loc.Location;


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
