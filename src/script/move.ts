// We define direction as change in square code:
// direction = destSquareCode - srcSquareCode
// 
// Therefore horizontal, vertical, diagonal and knight* moves can be represented as follows:
// *knight moves are denoted by square brackets
//
//  +18 [+19]  +20 [+21] +22
//  [+8]  +9   +10  +11 [+12] 
//   -2   -1  piece  +1   +2
// [-12] -11   -10   -9  [-8]
//  -22 [-21]  -20 [-19] -18
//
// Horizontal, vertical, and diagonal moves direction can be generalized by factoring out range.
// farAwayDirection = adjacentDirectionInLine * range
//
//  2*+9  [+19] 2*+10 [+21] 2*+11 
//  [+8]  1*+9  1*+10 1*+11 [+12] 
//  2*-1  1*-1  piece 1*+1  2*+1
//  [-12] 1*-11 1*-10 1*-9  [-8]
//  2*-11 [-21] 2*-10 [-19] 2*-9
//

export type Direction = number;

// Regular move (exclude conditional moves)
export interface Move {
     directions: Direction[],
     move: boolean,
     capture: boolean,
}

export const PawnMove: Move = Object.freeze({
     directions: [10],
     move: true,
     capture: false,
});

export const PawnCapture: Move = Object.freeze({
     directions: [9, 11],
     move: false,
     capture: true,
});

export const Knight: Move = Object.freeze({
     directions: [19, 21, 12, -8, -19, -21, -12, 8],
     move: true,
     capture: true,
});

export const Bishop: Move = Object.freeze({
     directions: [9, 11, -9, -11],
     move: true,
     capture: true,  
});

export const Rook: Move = Object.freeze({
     directions: [10, 1, -10, -1],
     move: true,
     capture: true, 
});

export const Queen: Move = Object.freeze({
     directions: [10, 11, 1, -9, -10, -11, -1, 9],
     move: true,
     capture: true,
});

export const King: Move = Object.freeze({
     directions: [10, 11, 1, -9, -10, -11, -1, 9],
     move: true,
     capture: true,
});