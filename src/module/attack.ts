import * as Loc from './location.js';
import * as Piece from './piece.js';
import * as AttackMap from './attack-map.js';
import { Color, opponentOf } from './color.js';
import { Position, getByLoc } from './position.js';
import { Direction } from './direction.js';
import { TypeRange } from './piece-move.js';
import { outOfBound } from './position-util.js';


type Location = Loc.Location;


export function getAttackersLoc(pos: Position, color: Color, loc: Location): Location[] {
    const piece = getByLoc(pos, loc);
    if(piece !== Piece.None && Piece.get(piece).color !== color) return [];
    
    const opponent = opponentOf(color);

    const map = AttackMap.get(color);
    let attackers: Location[] = [];

    for(const typeStr in map) {
        const type = parseInt(typeStr);
        const lines = map[type];

        for(const directionStr in lines) {
            const direction = parseInt(directionStr);
            const attackersList = lines[direction];

            const getAttackerFn = (type === TypeRange)? getRangeAttacker : getAttacker;
            const attackerLoc = getAttackerFn(pos, opponent, loc, direction, attackersList);
            if(attackerLoc !== Loc.None) attackers.push(attackerLoc);
        }
    }

    return attackers;
}

function getAttacker(pos: Position, opponent: Color, loc: Location, direction: Direction, attackers: string[]): Location {
    const none = Loc.None;
    let square = loc + direction;
    
    if(outOfBound(square)) return none;
    return isAttackerOn(square, pos, opponent, attackers)? square : none;
}

function getRangeAttacker(pos: Position, opponent: Color, loc: Location, direction: Direction, attackers: string[]): Location {
    let square = loc;

    while(!outOfBound(square += direction)) {
        if(isAttackerOn(square, pos, opponent, attackers)) return square;
        if(getByLoc(pos, square) !== Piece.None) break;
    }

    return Loc.None;
}

function isAttackerOn(square: Location, pos: Position, opponent: Color, attackers: string[]): boolean {
    const suspect = getByLoc(pos, square);
    if(suspect === Piece.None) return false;

    const piece = Piece.get(suspect);
    return piece.color === opponent && attackers.includes(suspect);
}
