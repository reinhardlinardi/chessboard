import { Square } from './square.js';

export type Location = number;

export function of(square: Square): Location {
    return 10*square.rank + square.file;
}

export function square(location: Location): Square {
    let rank = Math.trunc(location/10);
    return {rank: rank, file: location - 10*rank};
}