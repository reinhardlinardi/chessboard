import * as File from './file.js';

export interface Square {
    rank: number,
    file: number,
};

export function of(label: string, rank: number): Square {
    return {rank: rank, file: File.fileOf(label)};
};
