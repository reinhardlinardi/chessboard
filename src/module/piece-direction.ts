import * as Direction from './direction.js';


export type Directions = readonly Direction.Direction[];

export const WhitePawnAdvance: Directions = Object.freeze([Direction.Black]);
export const WhitePawnCapture: Directions = Object.freeze(Direction.BlackDiagonal);

export const BlackPawnAdvance: Directions = Object.freeze([Direction.White]);
export const BlackPawnCapture: Directions = Object.freeze(Direction.WhiteDiagonal);

export const Knight: Directions = Object.freeze([21, 19, 12, 8, -8, -12, -19, -21]);
export const Bishop: Directions = Object.freeze(Direction.Diagonal);
export const Rook: Directions = Object.freeze([...Direction.Vertical, ...Direction.Horizontal]);
export const Queen: Directions = Object.freeze(Direction.All);
export const King: Directions = Object.freeze(Direction.All);
