export type Flag = number;

export const move: Flag = 1 << 0;
export const capture: Flag = 1 << 1;

// Regular move (exclude special moves)
export interface Move {
     move: number[],
     range: number,
     flag: number,
}

export const PawnMove: Move = Object.freeze({
     move: [10],
     range: 1,
     flag: move,
});

export const PawnCapture: Move = Object.freeze({
     move: [9, 11],
     range: 1,
     flag: capture,
});

export const Knight: Move = Object.freeze({
     move: [19, 21, 12, -8, -19, -21, -12, 8],
     range: 1,
     flag: move | capture,  
});

export const Bishop: Move = Object.freeze({
     move: [9, 11, -9, -11],
     range: 10,
     flag: move | capture,  
});

export const Rook: Move = Object.freeze({
     move: [10, 1, -10, -1],
     range: 10,
     flag: move | capture,  
});

export const Queen: Move = Object.freeze({
     move: [10, 11, 1, -9, -10, -11, -1, 9],
     range: 10,
     flag: move | capture,  
});

export const King: Move = Object.freeze({
     move: [10, 11, 1, -9, -10, -11, -1, 9],
     range: 1,
     flag: move | capture,  
});