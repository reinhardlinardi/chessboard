import * as Common from './common.js';
import { Game } from '../module/analysis.js';
import * as Err from '../module/error.js';


const game = new Game();


/* Board */
export function rankOf(y) {
    return Common.rankOf(y, this.flip);
}

export function fileOf(x) {
    return Common.fileOf(x, this.flip);
}

export function labelOf(x) {
    return Common.labelOf(x, this.flip);
}

export function isEmpty(rank, file) {
    return Common.isEmpty(this.state.pos, rank, file);
}

export function getPiece(rank, file) {
    return Common.getPiece(this.state.pos, rank, file);
}

export function flipBoard() {
    this.flip = !this.flip;
}


/* State */
export function updateState() {
    let state = {...this.state};
    
    game.loadSetup(state);
    this.state = game.getSetupGameState();
}


/* Lifecycle */
export function created() {
    // game.loadSetup(State.New());
    // let state = game.getSetupGameState();

    // let state = defaultState;
    // if(Common.hasQueryParam(fenParam)) {
    //     let fen = Common.getQueryParam(fenParam);

    //     try {
    //         state = FEN.load(fen);
    //     }
    //     catch(err) {
    //         console.log(Err.str(err));
    //     }
    // }

    // this.updateState(state);
}
