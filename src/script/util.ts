// Deep copy
export function copyPosition(position: string[][]): string[][] {
    let copy: string[][] = new Array(8);

    for(let rank = 0; rank < 8; rank++) {
        copy[rank] = [...position[rank]];
    }
    return copy;
}