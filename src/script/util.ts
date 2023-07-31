import { Board } from './board.js';

// Deep copy
export function copyPosition(position: Board): Board {
    let copy: Board = new Array(8);

    for(let rank = 0; rank < 8; rank++) {
        copy[rank] = [...position[rank]];
    }
    return copy;
}