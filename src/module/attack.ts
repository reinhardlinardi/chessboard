import * as Loc from './location.js';
import * as Piece from './piece.js';
import * as AttackMap from './attack-map.js';
import { Color, opponentOf } from './color.js';
import { Position, getByLoc } from './position.js';
import { Size as size } from './size.js';
import { Direction } from './direction.js';
import { TypeRange } from './piece-move.js';
import { getKingLoc, outOfBound } from './position-util.js';


type Location = Loc.Location;
type Attacked = {[square: Location]: Direction};

export type Attacker = {[attacker: Location]: Direction};
export type Attacks = {[attacked: Location]: Attacker};
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


export function getAttacksOf(color: Color, pos: Position): Attacks {
    let attacks: Attacks = {};

    const opponent = opponentOf(color);

    for(let rank = 1; rank <= size; rank++) {
        for(let file = 1; file <= size; file++) {
            const loc = Loc.of(file, rank);
            
            const suspect = getByLoc(pos, loc);
            if(suspect === Piece.None) continue;
            
            const piece = Piece.get(suspect);
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

// export function getPinnedPiecesOf(color: Color, pos: Position, attackers: Attacks): Pin {
//     let pin: Pin = {};

//     const kingLoc = getKingLoc(pos, color);
//     const rangeAttackMap = AttackMap.get(color)[TypeRange];

//     for(const str in rangeAttackMap) {
//         const direction = parseInt(str);
//         let square = kingLoc;

//         while(!outOfBound(square += direction)) {
//             const object = getByLoc(pos, square);
//             if(object === Piece.None) continue;

//             const piece = Piece.get(object);
//             if(piece.color !== color || !isAttacked(square, attackers)) break;
            
//             // check if same direction
//             pin[square] = direction;
//             break;
//         }
//     }

//     return pin;
// }


function locAttackedFrom(loc: Location, pos: Position): Attacked {
    const attackType = Piece.get(getByLoc(pos, loc)).attack;

    const locAttackedFromFn = attackType === TypeRange? locRangeAttackedFrom : locDirectAttackedFrom;
    return locAttackedFromFn(loc, pos);
}

function locDirectAttackedFrom(loc: Location, pos: Position): Attacked {
    let attacked: Attacked = {};
    const attacker = Piece.get(getByLoc(pos, loc));

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
    const attacker = Piece.get(getByLoc(pos, loc));

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
