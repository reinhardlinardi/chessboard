import * as Common from './common.js';
import * as State from '../module/state.js';
import * as Position from '../module/position.js';
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
export function isSameState() {
    const ref = this.defaultState;
    const state = this.state;

    return state.id === ref.id && state.clock.halfmove === ref.clock.halfmove &&
        state.clock.fullmove === ref.clock.fullmove;
}

export function updateState(state) {
    this.state = state;
}


/* FEN */
const fenParam = "fen";

export function copyFEN(ev) {
    const fen = Common.getElement("fen").value;
    navigator.clipboard.writeText(fen);
    
    console.log("FEN copied");
}


/* Drag and drop */
export function onDragStart(ev) {
    Common.dragSetId(ev, ev.target.id);
}

export function onDropReplaceOrCopy(ev) {
    const srcId = Common.dropGetId(ev);
    const destId = ev.target.id;

    // Return if dnd to self
    if(srcId === destId) return;
    
    // Replace piece in dest
    const piece = Common.getDraggedPiece(srcId, this.state.pos);

    let pos = Position.copy(this.state.pos);
    Common.replacePiece(destId, piece, pos);

    // Remove piece in src if not tray
    if(!Common.fromTray(srcId)) Common.removePiece(srcId, pos);
    // this.updateState({pos: pos});
}

export function onDropRemove(ev) {
    // Get dragged piece id
    const srcId = Common.dropGetId(ev);

    // Remove piece if src is not tray
    if(!Common.fromTray(srcId)) {
        let pos = Position.copy(this.state.pos);
        
        Common.removePiece(srcId, pos);
        // this.updateState({pos: pos});
    }
}


/* Lifecycle */
export function created() {
    game.loadSetup(State.New());

    let state = game.getSetupGameState();
    this.defaultState = {
        clock: {...state.clock},
        id: state.id,
    };

    // if(Common.hasQueryParam(fenParam)) {
    //     let fen = Common.getQueryParam(fenParam);

    //     try {
    //         state = FEN.load(fen);
    //         game.loadSetup(state);
    //     }
    //     catch(err) {
    //         console.log(Err.str(err));
    //     }
    // }

    try {
        game.validateSetup();
        state = game.getSetupGameState();
    }
    catch(err) {
        console.log(Err.str(err));
    }

    game.start();
    this.updateState(state);
}
