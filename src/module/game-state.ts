import * as Loc from './location.js';
import { State as state } from "./state.js";
import { Result } from "./game-result.js";
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
    from: Loc.Location,
    to: Loc.Location,
    notation: string,
};
