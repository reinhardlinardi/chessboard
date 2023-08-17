import * as Common from './common.js';
import * as State from '../module/state.js';
import * as Setup from '../module/setup.js';
import * as Piece from '../module/piece.js';
import * as Castle from '../module/castle.js';
import * as Filter from '../module/filter.js';
import * as Position from '../module/position.js';
import * as FEN from '../module/fen.js';
import { White, Black } from '../module/color.js';
import { Game } from '../module/analysis.js';
import * as Err from '../module/error.js';


const game = new Game();


/* Tray */
const pieces = Piece.getList();

export const whitePieces = Filter.New(pieces, Piece.byColor(White))().map(piece => piece.letter);
export const blackPieces = Filter.New(pieces, Piece.byColor(Black))().map(piece => piece.letter);


export function getTrayPieceIdx() {
    return [...Array(whitePieces.length).keys()];
}

export function getTopTrayPiece(idx) {
    return this.flip? whitePieces[idx] : blackPieces[idx];  
}

export function getBottomTrayPiece(idx) {
    return this.flip? blackPieces[idx] : whitePieces[idx];
}


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

export function clearBoard() {
    this.updateState({pos: Setup.emptySetup()});
}

export function resetBoard() {
    this.updateState(State.New());
    this.flip = false;
}


/* Form */
const rights = Castle.getList();

export function white() {
    return White;
}

export function black() {
    return Black;
}

export function getWhiteCastleTypes() {
    return Filter.New(rights, Castle.byColor(White))();
}

export function getBlackCastleTypes() {
    return Filter.New(rights, Castle.byColor(Black))();
}

export function selectedMove(color) {
    return this.state.move === color;
}

export function setMove(ev) {
    this.updateState({move: ev.target.value});
}

export function setCastle(ev) {
    const data = Common.getElementData(ev.target.id);
    const type = data.castleType;
    const value = ev.target.checked;

    let rights = {...this.state.castle};
    rights[type] = value;
    this.updateState({castle: rights});
}


/* State */
export function isSameState() {
    const ref = this.initial;
    const state = this.state;

    return state.id === ref.id && state.clock.halfmove === ref.clock.halfmove &&
        state.clock.fullmove === ref.clock.fullmove;
}

export function updateState(keys) {
    let state = {...this.state};
    for(const key in keys) state[key] = keys[key];

    game.loadState(state);
    this.state = game.getInitialGameState();
}



/* FEN */
const fenParam = "fen";

export function getFEN() {
    if(this.isSameState()) Common.deleteQueryParam(fenParam);
    else Common.setQueryParam(fenParam, this.state.fen);

    return this.state.fen;
}

export function loadFEN(fen) {
    let state;
    
    try {
        state = FEN.load(fen);
        this.updateState(state);
    }
    catch(err) {
        console.log(Err.str(err));
    }
}


/* Event listener */
export function onChangeFEN(ev) {
    this.loadFEN(ev.target.value);
}


/* Drag and drop */
export function onDragStart(ev) {
    Common.dragSetId(ev, ev.target.id);
}

export function onDropReplaceOrCopy(ev) {
    const srcId = Common.dropGetId(ev);
    const destId = ev.target.id;

    // Return if src not valid or dnd to self
    if(srcId === "" || srcId === destId) return;
    
    // Replace piece in dest
    const piece = Common.getDraggedPiece(srcId, this.state.pos);

    let pos = Position.copy(this.state.pos);
    Common.replacePiece(destId, piece, pos);

    // Remove piece in src if not tray
    if(!Common.fromTray(srcId)) Common.removePiece(srcId, pos);
    this.updateState({pos: pos});
}

export function onDropRemove(ev) {
    // Get dragged piece id
    const srcId = Common.dropGetId(ev);

    // Remove piece if src is not tray
    if(!Common.fromTray(srcId)) {
        let pos = Position.copy(this.state.pos);
        
        Common.removePiece(srcId, pos);
        this.updateState({pos: pos});
    }
}


/* Lifecycle */
export function created() {
    game.loadState(State.New());

    let initial = game.getInitialGameState();
    this.initial = {
        clock: {...initial.clock},
        id: initial.id,
    };

    let state = initial;
    if(Common.hasQueryParam(fenParam)) {
        let fen = Common.getQueryParam(fenParam);

        try {
            state = FEN.load(fen);
        }
        catch(err) {
            console.log(Err.str(err));
        }
    }

    this.updateState(state);
}
