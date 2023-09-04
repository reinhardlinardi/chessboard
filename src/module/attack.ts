import * as Loc from './location.js';
import * as Piece from './piece.js';
import * as AttackMap from './attack-map.js';
import * as EnPassant from './en-passant.js';
import * as Pieces from './pieces.js';
import { Position, get, getByLoc } from './position.js';
import { Size as size } from './size.js';
import { Direction } from './direction.js';
import { TypeRange } from './piece-move.js';
import { TypeKing, TypeQueen, TypeRook } from './piece-type.js';
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
    return isAttacked(loc, attacks)? Object.keys(attacks[loc]).length : 0;
}

export function numKingAttackersOf(color: Color, pos: Position, attacks: Attacks): number {
    return numAttackersOf(getKingLoc(pos, color), attacks);
}


export function attacksOn(color: Color, pos: Position): Attacks {
    let attacks: Attacks = {};

    const opponent = opponentOf(color);

    for(let rank = 1; rank <= size; rank++) {
        for(let file = 1; file <= size; file++) {
            const loc = Loc.of(file, rank);
            
            const suspect = getByLoc(pos, loc);
            if(suspect === Piece.None) continue;
            
            const piece = Pieces.get(suspect);
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

            const piece = Pieces.get(subject);
            if(piece.color !== color) break;

            if(isAttacked(square, attacks)) {
                const attackers = attacks[square];
                
                for(const locKey in attackers) {
                    const loc = parseInt(locKey);
                    const attacker = Pieces.get(getByLoc(pos, loc));

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

export function isEnPassantIndirectPinned(target: Location, player: Color, pos: Position): boolean {
    if(target === Loc.None) return false;

    const rank = EnPassant.pawnRank(player);
    if(Loc.rank(getKingLoc(pos, player)) !== rank) return false;

    let pawnLoc: Location[] = [];
    const pawns = getEnPassantPawns(Loc.file(target), pos, player);
    const colors = getColors();

    for(const color of colors) {
        if(pawns[color].length !== 1) return false;
        pawnLoc.push(pawns[color][0]);
    }

    const opponent = opponentOf(player);

    const king = Pieces.getBy(player, TypeKing).letter;
    const opponentQueen = Pieces.getBy(opponent, TypeQueen).letter;
    const opponentRook = Pieces.getBy(opponent, TypeRook).letter;

    const search: {[c: Color]: string[]} = {[player]: [king], [opponent]: [opponentQueen, opponentRook]};

    const queensideFile = Loc.file(Math.min(...pawnLoc));
    const kingsideFile = Loc.file(Math.max(...pawnLoc));

    let queensideColor = player;
    let found = false;

    for(let file = queensideFile-1; file >= 1; file--) {
        const subject = get(pos, rank, file);
        if(subject === Piece.None) continue;

        for(const color of colors) {
            if(search[color].includes(subject)) {
                queensideColor = color;
                found = true;
                break;
            }
        }
        break;
    }
    if(!found) return false;
    
    const otherColor = opponentOf(queensideColor);

    for(let file = kingsideFile+1; file <= size; file++) {
        const subject = get(pos, rank, file);
        if(subject === Piece.None) continue;
        
        if(search[otherColor].includes(subject)) return true;
        else break;
    }
    
    return false;
}


function locAttackedFrom(loc: Location, pos: Position): Attacked {
    const attackType = Pieces.get(getByLoc(pos, loc)).attack;

    const locAttackedFromFn = attackType === TypeRange? locRangeAttackedFrom : locDirectAttackedFrom;
    return locAttackedFromFn(loc, pos);
}

function locDirectAttackedFrom(loc: Location, pos: Position): Attacked {
    let attacked: Attacked = {};
    const attacker = Pieces.get(getByLoc(pos, loc));

    for(const move of attacker.moves) {
        if(!move.capture) continue;

        for(const direction of move.directions) {
            const square = loc + direction;

            if(outOfBound(square)) continue;
            else attacked[square] = -direction;
        }
    }

    return attacked;
}

function locRangeAttackedFrom(loc: Location, pos: Position): Attacked {
    let attacked: Attacked = {};
    const attacker = Pieces.get(getByLoc(pos, loc));

    for(const move of attacker.moves) {
        if(!move.capture) continue;

        for(const direction of move.directions) {
            let square = loc;

            while(!outOfBound(square += direction)) {
                attacked[square] = -direction;
                if(getByLoc(pos, square) !== Piece.None) break;
            }
        }
    }

    return attacked;
}
