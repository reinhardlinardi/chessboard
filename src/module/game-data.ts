import { State as state } from "./state.js";
import { Result } from "./game-result.js";
import { Location } from './location.js';
import { Moves } from "./move.js";


export type PieceCount = {[piece: string]: number};
export type StateCount = {[id: string]: number};


export interface Setup extends state {
    fen: string,
    id: string,
};

export interface State extends Setup {
    ended: boolean,
    result: Result,
    pieces: PieceCount,
    repeat: StateCount,
    moves: Moves,
};

export interface GameMove {
    from: Location,
    to: Location,
    pgn: string,
};
