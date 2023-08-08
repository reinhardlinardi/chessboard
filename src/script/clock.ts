export const HalfmoveStart = 0;
export const FullmoveStart = 1; // move number starts from 1
export const MaxHalfmove = 100; // 50-move rule, 100 = draw


export interface Clock {
    halfmove: number,
    fullmove: number,
};

export function New(): Clock {
    return {halfmove: HalfmoveStart, fullmove: FullmoveStart};
}
