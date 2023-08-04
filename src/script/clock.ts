export interface Clock {
    halfmove: number,
    fullmove: number,
}

export function New(): Clock {
    return { halfmove: 0, fullmove: 1 };
}