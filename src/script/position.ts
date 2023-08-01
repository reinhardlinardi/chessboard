export type Position = string[][];

export function get(pos: Position, rank: number, file: number) {
    return pos[rank-1][file-1];
}

export function set(pos: Position, rank: number, file: number, piece: string) {
    pos[rank-1][file-1] = piece;
}

// Deep copy
export function copy(pos: Position): Position {
    let copy: Position = new Array(8);

    for(let rank = 0; rank < 8; rank++) {
        copy[rank] = [...pos[rank]];
    }
    return copy;
}