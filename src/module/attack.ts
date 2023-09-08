import * as Loc from './location.js';
import * as Piece from './piece.js';
import * as AttackMap from './attack-map.js';
import * as Pieces from './pieces.js';
import { Position, getByLoc } from './position.js';
import { Size as size } from './size.js';
import { Direction } from './direction.js';
import { TypeRange } from './piece-move.js';
import { Color, opponentOf } from './color.js';
import { getKingLoc, outOfBound } from './position-util.js';


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

    for(const directionStr in rangeAttackMap) {
        const direction = parseInt(directionStr);
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
