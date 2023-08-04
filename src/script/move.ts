import * as Direction from './direction.js';

// Regular move (exclude conditional moves)
export interface Move {
     directions: Direction.Direction[],
     move: boolean,
     capture: boolean,
}

export const WhitePawnAdvance: Move = Object.freeze({
     directions: [Direction.Black],
     move: true,
     capture: false,
});

export const WhitePawnCapture: Move = Object.freeze({
     directions: Direction.BlackDiagonal,
     move: false,
     capture: true,
});

export const BlackPawnAdvance: Move = Object.freeze({
     directions: [Direction.White],
     move: true,
     capture: false,
});

export const BlackPawnCapture: Move = Object.freeze({
     directions: Direction.WhiteDiagonal,
     move: false,
     capture: true,
});

export const Knight: Move = Object.freeze({
     directions: [21, 19, 12, 8, -8, -12, -19, -21],
     move: true,
     capture: true,
});

export const Bishop: Move = Object.freeze({
     directions: Direction.Diagonal,
     move: true,
     capture: true,  
});

export const Rook: Move = Object.freeze({
     directions: [...Direction.Vertical, ...Direction.Horizontal],
     move: true,
     capture: true, 
});

export const Queen: Move = Object.freeze({
     directions: Direction.All,
     move: true,
     capture: true,
});

export const King: Move = Object.freeze({
     directions: Direction.All,
     move: true,
     capture: true,
});