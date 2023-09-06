import { State as state } from "./state.js";
import { Result } from "./game-result.js";
import { Location } from './location.js';
import { Moves } from "./move.js";
import { PieceCount } from "./position-util.js";


export type StateCount = {[id: string]: number};


export interface Setup extends state {
    fen: string,
    id: string,
};

export interface State extends Setup {
    result: Result,
    pieces: PieceCount,
    repeat: StateCount,
    moves: Moves,
};

export interface Move {
    from: Location,
    to: Location,
    pgn: string,
};
