import * as Direction from './direction.js';
import * as Piece from './piece.js';
import * as Filter from './filter.js';
import { Color, White, Black, opponentOf } from './color.js';
import { Type } from './piece-attack.js';


export type Lines = {[direction: string]: string[]};
export type Attacks = {[t: Type]: Lines};
export type AttackMap = {[c: Color]: Attacks};

const attackMap: AttackMap = Object.freeze({
    [White]: attacksOn(White),
    [Black]: attacksOn(Black),
});

export function getMap(color: Color): Attacks {
    return attackMap[color];
}


type Attacker = {[d: Direction.Direction]: string};

function attacksOn(color: Color): Attacks {
    const pieces = Filter.New(Piece.getList(), Piece.byColor(opponentOf(color)))();

    let map: Attacker[] = [];
    for(const piece of pieces) {
        for(const capture of piece.capture) map.push({[-1*capture]: piece.letter});
    }

    map.sort(sortAttackers);
    let attacks: Attacks = {};

    for(const entry of map) {
        let direction = parseInt(Object.keys(entry)[0]);
        let piece = Piece.get(entry[direction]);
        let type = piece.attack;

        if(!(type in attacks)) attacks[type] = {};
        if(!(direction in attacks[type])) attacks[type][direction.toString()] = [];
        attacks[type][direction].push(piece.letter);
    }

    return attacks;
}

// Sort by direction, then attack type
function sortAttackers(first: Attacker, second: Attacker): number {
    let direction1 = parseInt(Object.keys(first)[0]);
    let direction2 = parseInt(Object.keys(second)[0]);

    let type1 = Piece.get(first[direction1]).attack;
    let type2 = Piece.get(second[direction2]).attack;

    if(direction1 === direction2) return type1 - type2;
    else return direction1 - direction2;
}
