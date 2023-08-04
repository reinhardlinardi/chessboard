import * as File from './file.js';

export interface Square {
    rank: number,
    file: number,
};

export function of(label: string, rank: number): Square {
    return {rank: rank, file: File.fileOf(label)};
}

export type Location = number;

export function toLocation(square: Square): Location {
    return 10*square.rank + square.file;
}

export function toSquare(location: Location): Square {
    let rank = Math.trunc(location/10);
    return {rank: rank, file: location - 10*rank};
}
