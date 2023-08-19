import * as D from './direction.js';


export const WhitePawnAdvance: readonly D.Direction[] = Object.freeze([D.Black]);
export const WhitePawnCapture: readonly D.Direction[] = Object.freeze(D.BlackDiagonal);

export const BlackPawnAdvance: readonly D.Direction[] = Object.freeze([D.White]);
export const BlackPawnCapture: readonly D.Direction[] = Object.freeze(D.WhiteDiagonal);

export const Knight: readonly D.Direction[] = Object.freeze([21, 19, 12, 8, -8, -12, -19, -21]);
export const Bishop: readonly D.Direction[] = Object.freeze(D.Diagonal);
export const Rook: readonly D.Direction[] = Object.freeze([...D.Vertical, ...D.Horizontal]);
export const Queen: readonly D.Direction[] = Object.freeze(D.All);
export const King: readonly D.Direction[] = Object.freeze(D.All);
