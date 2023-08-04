// Direction = change in square location = dest location - src location
export type Direction = number;

// Map of common directions:
//
// 2*+9  |       | 2*+10 |       | 2*+11 
// ------+-------+-------+-------+------
//       | 1*+9  | 1*+10 | 1*+11 | 
// ------+-------+-------+-------+------
// 2*-1  | 1*-1  |   x   | 1*+1  | 2*+1
// ------+-------+-------+-------+------
//       | 1*-11 | 1*-10 | 1*-9  | 
// ------+-------+-------+-------+------
// 2*-11 |       | 2*-10 |       | 2*-9

export const Black: Direction = 10;
export const White: Direction = -10;
export const Kingside: Direction = 1;
export const Queenside: Direction = -1;

export const Vertical: Direction[] = [White, Black];
export const Horizontal: Direction[] = [Kingside, Queenside];

export const BlackDiagonal: Direction[] = [Black+Kingside, Black+Queenside];
export const WhiteDiagonal: Direction[] = [White+Kingside, White+Queenside];

export const Diagonal: Direction[] = [...BlackDiagonal, ...WhiteDiagonal];

export const All: Direction[] = [...Vertical, ...Horizontal, ...Diagonal];