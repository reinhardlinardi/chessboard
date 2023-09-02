// Dead position (https://en.wikipedia.org/wiki/Rules_of_chess#Dead_position)

import * as p from './piece-type.js'
import * as Piece from './piece.js';
import * as Filter from './filter-util.js';
import * as AbstractPiece from './abstract-piece.js';
import { PieceCount } from './game-data.js';
import { Color, White, Black, getList as getColors } from './color.js';


export type TypeCount = {[type: p.Type]: number};
export type Position = {0: TypeCount, 1: TypeCount};


const king = p.TypeKing;
const bishop = p.TypeBishop;
const knight = p.TypeKnight;

const loneKing: TypeCount = {[king]: 1};
const kingBishop: TypeCount = {...loneKing, [bishop]: 1};
const kingKnight: TypeCount = {...loneKing, [knight]: 1};


// [{"0": {"5": 1}, "1": {"5": 1}}, ...]
const positions: readonly Position[] = Object.freeze([
    {0: loneKing, 1: loneKing},
    {0: loneKing, 1: kingKnight},
    {0: loneKing, 1: kingBishop},
]);


type TypeCountMap = {[c: Color]: TypeCount};

export function isDead(count: PieceCount): boolean {
    for(const pos of positions) {
        const count0 = setDefaultZero(pos[0]);
        const count1 = setDefaultZero(pos[1]);

        const map1 = {[White]: count0, [Black]: count1};
        const map2 = {[White]: count1, [Black]: count0};

        if(isCountMatch(count, map1) || isCountMatch(count, map2)) return true;
    }
    return false;
}

function isCountMatch(count: PieceCount, expected: TypeCountMap): boolean {
    const colors = getColors();
    let actual: TypeCountMap = {};

    for(const color of colors) {
        const pieces = Filter.getPieces(Piece.byColor(color));
        actual[color] = pieces.reduce((map, piece) => ({...map, [piece.type]: count[piece.letter]}), {});
    }

    for(const color of colors) {
        for(const type in expected[color]) {
            if(actual[color][type] !== expected[color][type]) return false;
        }
    }
    return true;
}

function setDefaultZero(t: TypeCount): TypeCount {
    const count: TypeCount = AbstractPiece.getList().reduce((map, piece) => ({...map, [piece.type]: 0}), {});
    for(const type in t) count[type] = t[type];

    return count;
}
