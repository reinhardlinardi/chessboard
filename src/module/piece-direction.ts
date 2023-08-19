import * as Drc from './direction.js';


export const WhitePawnAdvance: readonly Drc.Direction[] = Object.freeze([Drc.Black]);
export const WhitePawnCapture: readonly Drc.Direction[] = Object.freeze(Drc.BlackDiagonal);

export const BlackPawnAdvance: readonly Drc.Direction[] = Object.freeze([Drc.White]);
export const BlackPawnCapture: readonly Drc.Direction[] = Object.freeze(Drc.WhiteDiagonal);

export const Knight: readonly Drc.Direction[] = Object.freeze([21, 19, 12, 8, -8, -12, -19, -21]);
export const Bishop: readonly Drc.Direction[] = Object.freeze(Drc.Diagonal);
export const Rook: readonly Drc.Direction[] = Object.freeze([...Drc.Vertical, ...Drc.Horizontal]);
export const Queen: readonly Drc.Direction[] = Object.freeze(Drc.All);
export const King: readonly Drc.Direction[] = Object.freeze(Drc.All);
