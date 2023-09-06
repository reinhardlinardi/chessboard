import * as Loc from './location.js';
import * as EnPassant from './en-passant.js';
import * as Piece from './piece.js';
import * as Pieces from './pieces.js';
import { Size as size } from './size.js';
import { Position, get, getByLoc } from './position.js';
import { TypeKing, TypePawn } from './piece-type.js';
import { Color, opponentOf, getList as getColors } from './color.js';


type Location = Loc.Location;

export type EnPassantPawns = {[c: Color]: Location[]};
export type PieceCount = {[piece: string]: number};


export function outOfBound(loc: Location): boolean {
    const file = Loc.file(loc);
    const rank = Loc.rank(loc);

    return file < 1 || file > size || rank < 1 || rank > size;
}

export function getKingLoc(pos: Position, color: Color): Location {
    const king = Pieces.getBy(color, TypeKing).letter;

    for(let rank = 1; rank <= size; rank++) {
        for(let file = 1; file <= size; file++) {
            const piece = get(pos, rank, file);
            if(piece === king) return Loc.of(file, rank);
        }
    }

    return Loc.None;
}

export function getPieceCount(pos: Position): PieceCount {
    let count: PieceCount = Pieces.getList().reduce((map, piece) => ({...map, [piece.letter]: 0}), {});

    for(let rank = 1; rank <= size; rank++) {
        for(let file = 1; file <= size; file++) {
            const piece = get(pos, rank, file);
            if(piece !== Piece.None) count[piece]++;
        }
    }
    return count;
}

export function getEnPassantPawns(file: number, pos: Position, player: Color): EnPassantPawns {
    let pawns: EnPassantPawns = {};
    const colors = getColors();

    for(const color of colors) {
        pawns[color] = [];
    }
    
    const opponent = opponentOf(player);
    const playerPawn = Pieces.getBy(player, TypePawn).letter;
    const opponentPawn = Pieces.getBy(opponent, TypePawn).letter;

    const opponentLoc = EnPassant.opponentPawnLoc(file, player);
    if(getByLoc(pos, opponentLoc) === opponentPawn) pawns[opponent].push(opponentLoc);

    const playerLoc = EnPassant.playerPawnsLoc(file, player);
    for(const loc of playerLoc) {
        if(getByLoc(pos, loc) === playerPawn) pawns[player].push(loc);
    }
    return pawns;
}
