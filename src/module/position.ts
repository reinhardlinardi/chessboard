import { Size as size } from './size.js';
import * as Loc from './location.js';


export type Position = string[][];


export function New(): Position {
    return new Array(size);
}

export function get(pos: Position, rank: number, file: number): string {
    return pos[rank-1][file-1];
}

export function getByLoc(pos: Position, loc: Loc.Location): string {
    return get(pos, Loc.rank(loc), Loc.file(loc));
}

export function set(piece: string, pos: Position, rank: number, file: number) {
    pos[rank-1][file-1] = piece;
}

export function setByLoc(piece: string, pos: Position, loc: Loc.Location) {
    set(piece, pos, Loc.rank(loc), Loc.file(loc));
}


export function getRow(pos: Position, rank: number): string[] {
    return [...pos[rank-1]];   
}
 
export function setRow(row: string[], pos: Position, rank: number) {
    pos[rank-1] = [...row];
}

export function copy(pos: Position): Position {
    let copy: Position = New();

    for(let rank = 1; rank <= size; rank++) {
        setRow(getRow(pos, rank), copy, rank);
    }
    return copy;
}
