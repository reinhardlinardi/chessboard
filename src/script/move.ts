// Move value is defined as change in square code.
// Move value = dest square code - src square code
//
// Let's assume there is a piece on #.
// These will be the move values to nearby squares.
// Knight moves are enclosed in square brackets.
//
//  +18 [+19] +20 [+21] +22
//  [+8]  +9  +10  +11 [+12] 
//   -2   -1   #    +1   +2
// [-12] -11  -10   -9  [-8]
//  -22 [-21] -20 [-19] -18
//
// Except for knight moves, we can generalize further by adding range multiplier n.
// Values enclosed in parentheses are derived using range multiplier.
//
// (+18) +19 (+20) +21 (+22) 
//  +8   +9n  +10n +11n +12 
// (-2)  -n    #    +n  (+2)
//  -12 -11n -10n  -9n   -8
// (-22) -21 (-20) -19 (-18)


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