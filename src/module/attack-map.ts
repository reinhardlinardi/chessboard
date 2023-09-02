import * as Pieces from './pieces.js';
import { Type } from './piece-move.js';
import { Color, White, Black, opponentOf } from './color.js';


export type Lines = {[direction: string]: string[]};
export type Attacks = {[t: Type]: Lines};
export type Map = {[c: Color]: Attacks};


// {"w": {"0": {"1": ["k"], "8": ["n"], "9": ["p", "k"], ...}, "1": {"1": ["r", "q"], ...}}, "b": ...}
const attackMap: Map = Object.freeze({
    [White]: attacksOn(White),
    [Black]: attacksOn(Black),
});

export function get(color: Color): Attacks {
    return attackMap[color];
}


type Attacker = {[direction: string]: string};

function attacksOn(color: Color): Attacks {
    const opponent = opponentOf(color);
    const pieces = Pieces.getByColor(opponent);

    let map: Attacker[] = [];
    for(const piece of pieces) {
        for(const move of piece.moves) {
            if(!move.capture) continue;
            for(const direction of move.directions) map.push({[-1*direction]: piece.letter});
        }
    }

    map.sort(sortAttackers);
    let attacks: Attacks = {};

    for(const entry of map) {
        let direction = Object.keys(entry)[0];
        let piece = Pieces.get(entry[direction]);
        let type = piece.attack;

        if(!(type in attacks)) attacks[type] = {};
        if(!(direction in attacks[type])) attacks[type][direction] = [];
        attacks[type][direction].push(piece.letter);
    }

    return attacks;
}

// Sort by direction, then attack type
function sortAttackers(first: Attacker, second: Attacker): number {
    let direction1 = parseInt(Object.keys(first)[0]);
    let direction2 = parseInt(Object.keys(second)[0]);

    let type1 = Pieces.get(first[direction1]).attack;
    let type2 = Pieces.get(second[direction2]).attack;

    if(direction1 === direction2) return type1 - type2;
    else return direction1 - direction2;
}
