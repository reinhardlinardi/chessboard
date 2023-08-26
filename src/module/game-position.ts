import * as Location from './location.js';
import * as Piece from './piece.js';
import * as Attack from './attack.js';
import { Color, opponentOf } from './color.js';
import { Position, getByLocation } from './position.js';
import { Direction } from './direction.js';
import { TypeRange } from './piece-move.js';
import { outOfBound } from './game-position-util.js';
import * as Err from './game-position-error.js';


type Loc = Location.Location;

export function analyzeAttackOn(pos: Position, color: Color, loc: Loc): Loc[] {
    const piece = getByLocation(pos, loc);
    if(piece !== Piece.None) {
        if(Piece.get(piece).color !== color) throw Err.New(Err.ConflictParam, "color not equal piece color");
    }
    
    const opponent = opponentOf(color);

    const map = Attack.getMap(color);
    let attackers: Loc[] = [];

    for(const typeStr in map) {
        const type = parseInt(typeStr);
        const lines = map[type];

        for(const directionStr in lines) {
            const direction = parseInt(directionStr);
            const attackersList = lines[direction];

            const getAttackerFn = (type === TypeRange)? getRangeAttacker : getAttacker;
            const attackerLoc = getAttackerFn(pos, opponent, loc, direction, attackersList);
            if(attackerLoc !== Location.None) attackers.push(attackerLoc);
        }
    }

    return attackers;
}

function getAttacker(pos: Position, opponent: Color, loc: Loc, direction: Direction, attackers: string[]): Loc {
    const none = Location.None;

    let square = loc + direction;
    if(outOfBound(square)) return none;

    const suspect = getByLocation(pos, square);
    if(suspect === Piece.None) return none;

    return isAttacker(suspect, opponent, attackers)? square : none;
}

function getRangeAttacker(pos: Position, opponent: Color, loc: Loc, direction: Direction, attackers: string[]): Loc {
    let square = loc;

    while(!outOfBound(square += direction)) {
        const suspect = getByLocation(pos, square);
        if(suspect === Piece.None) continue;

        if(isAttacker(suspect, opponent, attackers)) return square;
        else break;
    }

    return Location.None;
}

function isAttacker(suspect: string, opponent: Color, attackers: string[]): boolean {
    const piece = Piece.get(suspect);
    return piece.color === opponent && attackers.includes(suspect);
}
