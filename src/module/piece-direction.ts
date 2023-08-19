import * as Direction from './direction.js';


export const WhitePawnAdvance: readonly Direction.Direction[] = Object.freeze([Direction.Black]);
export const WhitePawnCapture: readonly Direction.Direction[] = Object.freeze(Direction.BlackDiagonal);

export const BlackPawnAdvance: readonly Direction.Direction[] = Object.freeze([Direction.White]);
export const BlackPawnCapture: readonly Direction.Direction[] = Object.freeze(Direction.WhiteDiagonal);

export const Knight: readonly Direction.Direction[] = Object.freeze([21, 19, 12, 8, -8, -12, -19, -21]);
export const Bishop: readonly Direction.Direction[] = Object.freeze(Direction.Diagonal);
export const Rook: readonly Direction.Direction[] = Object.freeze([...Direction.Vertical, ...Direction.Horizontal]);
export const Queen: readonly Direction.Direction[] = Object.freeze(Direction.All);
export const King: readonly Direction.Direction[] = Object.freeze(Direction.All);
