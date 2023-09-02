import * as Loc from './location.js';
import * as Piece from './piece.js';
import * as AttackMap from './attack-map.js';
import * as EnPassant from './en-passant.js';
import * as Filter from './filter.js';
import { Position, get, getByLoc } from './position.js';
import { Size as size } from './size.js';
import { Direction } from './direction.js';
import { TypeRange } from './piece-move.js';
import { TypeKing, TypeQueen, TypeRook } from './piece-type.js';
import { get as getPiece } from './piece-list.js';
import { Color, opponentOf, getList as getColors } from './color.js';
import { getEnPassantPawns, getKingLoc, outOfBound } from './position-util.js';


type Location = Loc.Location;
type Attacked = {[square: Location]: Direction};

export type Attackers = {[attacker: Location]: Direction};
export type Attacks = {[attacked: Location]: Attackers};
export type Pin = {[pinned: Location]: Direction};


export function isAttacked(loc: Location, attacks: Attacks): boolean {
    return loc in attacks;
}

export function isKingAttacked(color: Color, pos: Position, attacks: Attacks): boolean {
    return isAttacked(getKingLoc(pos, color), attacks);
}

export function numAttackersOf(loc: Location, attacks: Attacks): number {
    return Object.keys(attacks[loc]).length;
}


export function attacksOn(color: Color, pos: Position): Attacks {
    let attacks: Attacks = {};

    const opponent = opponentOf(color);

    for(let rank = 1; rank <= size; rank++) {
        for(let file = 1; file <= size; file++) {
            const loc = Loc.of(file, rank);
            
            const suspect = getByLoc(pos, loc);
            if(suspect === Piece.None) continue;
            
            const piece = getPiece(suspect);
            if(piece.color !== opponent) continue;

            const attacked = locAttackedFrom(loc, pos);
            for(const square in attacked) {
                if(!(square in attacks)) attacks[square] = {};
                attacks[square][loc] = attacked[square];
            }
        }
    }

    return attacks;
}

export function pinnedPiecesOf(color: Color, pos: Position, attacks: Attacks): Pin {
    let pin: Pin = {};

    const kingLoc = getKingLoc(pos, color);
    const rangeAttackMap = AttackMap.get(color)[TypeRange];

    for(const mapKey in rangeAttackMap) {
        const direction = parseInt(mapKey);
        let square = kingLoc;

        while(!outOfBound(square += direction)) {
            const subject = getByLoc(pos, square);
            if(subject === Piece.None) continue;

            const piece = getPiece(subject);
            if(piece.color !== color) break;

            if(isAttacked(square, attacks)) {
                const attackers = attacks[square];
                
                for(const locKey in attackers) {
                    const loc = parseInt(locKey);
                    const attacker = getPiece(getByLoc(pos, loc));

                    // Only range attackers can pin
                    if(attacker.attack !== TypeRange) continue;
                    if(attackers[loc] === direction) {
                        pin[square] = direction;
                        break;
                    }
                }
            }
            break;
        }
    }

    return pin;
}

// export function isEnPassantIndirectPinned(file: number, player: Color, pos: Position): boolean {
//     const rank = EnPassant.pawnRank(player);
//     if(Loc.rank(getKingLoc(pos, player)) !== rank) return false;
    
//     const colors = getColors();
//     const pawns = getEnPassantPawns(file, pos, player);
//     for(const color of colors) {
//         if(pawns[color].length !== 1) return false;
//     }

//     const opponent = opponentOf(player);

//     const king = Filter.New(Piece.getList(), Piece.byColor(player), Piece.byType(TypeKing))()[0].letter;
//     const opponentQueen = Filter.New(Piece.getList(), Piece.byColor(opponent), Piece.byType(TypeRook))()[0].letter;
//     const opponentRook = Filter.New(Piece.getList(), Piece.byColor(opponent), Piece.byType(TypeRook))()[0].letter;

//     const search: {[c: Color]: string} = {}
    
//     const playerPawnLoc = pawns[player][0];
//     const opponentPawnLoc = pawns[opponent][0];

//     const queenside = Loc.file(Math.min(playerPawnLoc, opponentPawnLoc));
//     const kingside = Loc.file(Math.max(playerPawnLoc, opponentPawnLoc));

//     for(let file = queenside; file >= 1; file--) {
//         if(get(pos, rank, file) !== Piece.None) {
//         }
//     }
//     return true;
// }


function locAttackedFrom(loc: Location, pos: Position): Attacked {
    const attackType = getPiece(getByLoc(pos, loc)).attack;

    const locAttackedFromFn = attackType === TypeRange? locRangeAttackedFrom : locDirectAttackedFrom;
    return locAttackedFromFn(loc, pos);
}

function locDirectAttackedFrom(loc: Location, pos: Position): Attacked {
    let attacked: Attacked = {};
    const attacker = getPiece(getByLoc(pos, loc));

    for(const move of attacker.moves) {
        if(!move.capture) continue;

        for(const direction of move.directions) {
            const square = loc + direction;

            if(outOfBound(square)) continue;
            else attacked[square] = -1*direction;
        }
    }

    return attacked;
}

function locRangeAttackedFrom(loc: Location, pos: Position): Attacked {
    let attacked: Attacked = {};
    const attacker = getPiece(getByLoc(pos, loc));

    for(const move of attacker.moves) {
        if(!move.capture) continue;

        for(const direction of move.directions) {
            let square = loc;

            while(!outOfBound(square += direction)) {
                attacked[square] = -1*direction;
                if(getByLoc(pos, square) !== Piece.None) break;
            }
        }
    }

    return attacked;
}
