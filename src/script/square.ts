import * as File from './file.js';

export interface Square {
    rank: number,
    file: number,
};

export function of(label: string, rank: number): Square {
    return {rank: rank, file: File.fileOf(label)};
}

// Code is each square unique number identifier
export type Code = number;

export function codeOf(square: Square): Code {
    return 10*square.rank + square.file;
}

export function squareOf(code: Code): Square {
    let rank = Math.trunc(code/10);
    return {rank: rank, file: code - 10*rank};
}
