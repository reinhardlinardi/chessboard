import * as Piece from './piece.js';
import * as Filter from './filter.js';
import * as Loc from './location.js';
import * as File from './file.js';
import * as EnPassant from './en-passant.js';
import { Color, getList as getColors, opponentOf } from './color.js';
import { Size as size } from './size.js';
import { Position, get, getByLoc } from './position.js';
import { TypeKing, TypePawn } from './piece-type.js';


type Location = Loc.Location;
type EnPassantLoc = {[c: Color]: Location[]};


export function outOfBound(loc: Location): boolean {
    const file = Loc.file(loc);
    const rank = Loc.rank(loc);

    return file < 1 || file > size || rank < 1 || rank > size;
}

export function getKingLoc(pos: Position, color: Color): Location {
    const pieces = Piece.getList();
    const king = Filter.New(pieces, Piece.byType(TypeKing), Piece.byColor(color))()[0].letter;

    for(let rank = 1; rank <= size; rank++) {
        for(let file = 1; file <= size; file++) {
            const piece = get(pos, rank, file);
            if(piece === king) return Loc.of(file, rank);
        }
    }

    return Loc.None;
}

export function getEnPassantPawns(file: number, pos: Position, player: Color): EnPassantLoc {
    let loc: EnPassantLoc = {};
    const opponent = opponentOf(player);

    const pawn: {[c: Color]: string} = {};
    const pieces = Piece.getList();
    const colors = getColors();

    for(const color of colors) {
        pawn[color] = Filter.New(pieces, Piece.byType(TypePawn), Piece.byColor(color))()[0].letter;
        loc[color] = [];
    }

    const opponentPawn = EnPassant.opponentPawnLoc(file, player);
    if(getByLoc(pos, opponentPawn) === pawn[opponent]) loc[opponent].push(opponentPawn);

    const playerPawns = EnPassant.playerPawnsLoc(file, player);
    for(const playerPawn of playerPawns) {
        if(getByLoc(pos, playerPawn) === pawn[player]) loc[player].push(playerPawn);
    }
    return loc;
}

export function isRookPawn(loc: Location, pos: Position): boolean {
    if(!isPawn(loc, pos)) return false;

    const file = Loc.file(loc);
    return file === File.a || file === File.h;
}

function isPawn(loc: Location, pos: Position): boolean {
    const subject = getByLoc(pos, loc);
    if(subject === Piece.None) return false;

    const piece = Piece.get(subject);
    return piece.type === TypePawn;
}
