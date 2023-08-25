import * as Direction from './piece-direction.js';


export type Type = number;

export const TypeDirect: Type = 0;
export const TypeRange: Type = 1;


export interface Move {
    directions: Direction.Directions,
    move: boolean,
    capture: boolean,
};

export const WhitePawnAdvance = Object.freeze({
    directions: Direction.WhitePawnAdvance,
    move: true,
    capture: false,
});

export const WhitePawnCapture = Object.freeze({
    directions: Direction.WhitePawnCapture,
    move: false,
    capture: true,
});

export const BlackPawnAdvance = Object.freeze({
    directions: Direction.BlackPawnAdvance,
    move: true,
    capture: false,
});

export const BlackPawnCapture = Object.freeze({
    directions: Direction.BlackPawnCapture,
    move: false,
    capture: true,
});

export const Knight = Object.freeze({
    directions: Direction.Knight,
    move: true,
    capture: true,
});

export const Bishop = Object.freeze({
    directions: Direction.Bishop,
    move: true,
    capture: true,
});

export const Rook = Object.freeze({
    directions: Direction.Rook,
    move: true,
    capture: true,
});

export const Queen = Object.freeze({
    directions: Direction.Queen,
    move: true,
    capture: true,
});

export const King = Object.freeze({
    directions: Direction.King,
    move: true,
    capture: true,
});
