import * as Loc from './location.js';
import * as Piece from './piece.js';
import * as Attack from './attack.js';
import { Color, opponentOf } from './color.js';
import { Position, getByLoc } from './position.js';
import { Direction } from './direction.js';
import { TypeRange } from './piece-move.js';
import { outOfBound } from './game-position-util.js';
import * as Err from './game-position-error.js';


type Loc = Loc.Location;

export function analyzeAttackOn(pos: Position, color: Color, loc: Loc): Loc[] {
    const piece = getByLoc(pos, loc);
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
            if(attackerLoc !== Loc.None) attackers.push(attackerLoc);
        }
    }

    return attackers;
}

function getAttacker(pos: Position, opponent: Color, loc: Loc, direction: Direction, attackers: string[]): Loc {
    const none = Loc.None;
    let square = loc + direction;
    
    if(outOfBound(square)) return none;
    return isAttackerOn(square, pos, opponent, attackers)? square : none;
}

function getRangeAttacker(pos: Position, opponent: Color, loc: Loc, direction: Direction, attackers: string[]): Loc {
    let square = loc;

    while(!outOfBound(square += direction)) {
        if(isAttackerOn(square, pos, opponent, attackers)) return square;
        if(getByLoc(pos, square) !== Piece.None) break;
    }

    return Loc.None;
}

function isAttackerOn(square: Loc, pos: Position, opponent: Color, attackers: string[]): boolean {
    const suspect = getByLoc(pos, square);
    if(suspect === Piece.None) return false;

    const piece = Piece.get(suspect);
    return piece.color === opponent && attackers.includes(suspect);
}
