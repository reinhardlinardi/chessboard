import * as Loc from './location.js';
import * as Piece from './piece.js';
import * as AttackMap from './attack-map.js';
import { Color, opponentOf } from './color.js';
import { Position, getByLoc } from './position.js';
import { Direction } from './direction.js';
import { Size as size } from './size.js';
import { TypeRange } from './piece-move.js';
import { outOfBound } from './position-util.js';


type Location = Loc.Location;

export type Attackers = {[loc: Location]: Location[]};


export function getAttackersOf(color: Color, pos: Position): Attackers {
    let attackers: Attackers = {};

    const opponent = opponentOf(color);

    for(let rank = 1; rank <= size; rank++) {
        for(let file = 1; file <= size; file++) {
            const loc = Loc.of(file, rank);
            
            const suspect = getByLoc(pos, loc);
            if(suspect === Piece.None) continue;
            
            const piece = Piece.get(suspect);
            if(piece.color !== opponent) continue;

            const attacked = getLocAttackedBy(opponent, loc, pos);
            for(const square of attacked) {
                if(!(square in attackers)) attackers[square] = [];
                attackers[square].push(loc);
            }
        }
    }

    return attackers;
}

function getLocAttackedBy(color: Color, loc: Location, pos: Position): Location[] {
    const piece = Piece.get(getByLoc(pos, loc));

    const getLocAttackedFn = piece.attack === TypeRange? getLocRangeAttackedBy : getLocDirectAttackedBy;
    return getLocAttackedFn(color, loc, pos);
}

function getLocDirectAttackedBy(color: Color, loc: Location, pos: Position): Location[] {
    let attacked: Location[] = [];

    const opponent = opponentOf(color);
    const piece = Piece.get(getByLoc(pos, loc));

    for(const move of piece.moves) {
        if(!move.capture) continue;

        for(const direction of move.directions) {
            const square = loc + direction;
            if(outOfBound(square)) continue;

            const object = getByLoc(pos, square);
            if(object === Piece.None || Piece.get(object).color === opponent) attacked.push(square);
        }
    }

    return attacked;
}

function getLocRangeAttackedBy(color: Color, loc: Location, pos: Position): Location[] {
    let attacked: Location[] = [];

    const opponent = opponentOf(color);
    const piece = Piece.get(getByLoc(pos, loc));

    for(const move of piece.moves) {
        if(!move.capture) continue;

        for(const direction of move.directions) {
            let square = loc;

            while(!outOfBound(square += direction)) {
                const object = getByLoc(pos, square);
                
                if(object === Piece.None) {
                    attacked.push(square);
                    continue;
                }

                if(Piece.get(object).color === opponent) attacked.push(square);
                break;
            }
        }
    }

    return attacked;
}
