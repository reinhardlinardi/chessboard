import * as Location from './location.js';
import * as Piece from './piece.js';
import * as Attack from './attack.js';
import { Color, White, Black, opponentOf } from './color.js';
import { Position, getByLocation } from './position.js';
import { Size as size } from './size.js';
import { Direction } from './direction.js';
import { TypeRange } from './piece-move.js';
import * as Err from './game-position-error.js';


export function analyzeAttackOn(pos: Position, color: Color, loc: Location.Location): Location.Location[] {
    const piece = getByLocation(pos, loc);
    if(piece !== Piece.None) {
        if(Piece.get(piece).color !== color) throw Err.New(Err.ConflictParam, "color not equal piece color");
    }
    
    const opponent = opponentOf(color);

    const map = Attack.getMap(color);
    let attackers: Location.Location[] = [];

    for(const typeStr in map) {
        const type = parseInt(typeStr);
        const lines = map[type];

        for(const directionStr in lines) {
            const direction = parseInt(directionStr);
            const pieces = lines[direction];

            const getAttackerFn = (type === TypeRange)? getRangeAttacker : getAttacker;
            const attackerLoc = getAttackerFn(pos, opponent, loc, direction, pieces);
            if(attackerLoc !== Location.None) attackers.push(attackerLoc);
        }
    }

    return attackers;
}

function getAttacker(pos: Position, opponent: Color, loc: Location.Location, direction: Direction, pieces: string[]): Location.Location {
    const none = Location.None;

    let square = loc + direction;
    if(outOfBound(square)) return none;

    const letter = getByLocation(pos, square);
    if(letter === Piece.None) return none;
    
    const piece = Piece.get(letter);
    if(piece.color !== opponent) return none;

    return pieces.includes(piece.letter)? square : none;
}

function getRangeAttacker(pos: Position, opponent: Color, loc: Location.Location, direction: Direction, pieces: string[]): Location.Location {
    let square = loc;

    while(!outOfBound(square += direction)) {
        const letter = getByLocation(pos, square);
        if(letter === Piece.None) continue;

        const piece = Piece.get(letter);
        if(piece.color === opponent && pieces.includes(piece.letter)) return square;
        else break;
    }

    return Location.None;
}

function outOfBound(loc: Location.Location): boolean {
    const file = Location.file(loc);
    const rank = Location.rank(loc);

    return !(file >= 1 && file <= size && rank >= 1 && rank <= size);
}
