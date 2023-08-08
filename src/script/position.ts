import { Size as size } from './size.js';

export type Position = string[][];

export function get(pos: Position, rank: number, file: number): string {
    return pos[rank-1][file-1];
}

export function set(piece: string, pos: Position, rank: number, file: number) {
    pos[rank-1][file-1] = piece;
}

// Deep copy
export function copy(pos: Position): Position {
    let copy: Position = new Array(size);

    for(let rank = 1; rank <= size; rank++) {
        copy[rank-1] = [...pos[rank-1]];
    }
    return copy;
}
