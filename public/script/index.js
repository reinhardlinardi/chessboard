import * as Common from './common.js';
import * as Editor from '../module/editor.js';
import * as State from '../module/state.js';
import * as Setup from '../module/setup.js';
import * as Piece from '../module/piece.js';
import * as Castle from '../module/castle.js';
import * as File from '../module/file.js';
import { White, Black } from '../module/color.js';
import * as Err from '../module/error.js';


/* Tray */
export const topTray = Piece.filterBy(Piece.colorFilter(Black)).map(piece => piece.letter);
export const bottomTray = Piece.filterBy(Piece.colorFilter(White)).map(piece => piece.letter);


export function getTrayPieceIdx() {
    return [...Array(topTray.length).keys()];
}

export function getTopTrayPiece(idx) {
    return this.flip? bottomTray[idx] : topTray[idx];  
}

export function getBottomTrayPiece(idx) {
    return this.flip? topTray[idx] : bottomTray[idx];
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
    this.state.pos = Setup.emptySetup();
}

export function resetBoard() {
    this.state = State.New();
    this.flip = false;
}


/* Form */
export function whiteColor() {
    return White;
}

export function blackColor() {
    return Black;
}

export function getWhiteCastleTypes() {
    return Castle.filterBy(Castle.colorFilter(White));
}

export function getBlackCastleTypes() {
    return Castle.filterBy(Castle.colorFilter(Black));
}

export function setCastle(ev) {
    const data = Common.getElementData(ev.target.id);
    const type = data.castleType;
    const value = ev.target.checked;

    this.state.castle[type] = value;
}

export function disableCastle(type) {
    const hasPosition = Editor.hasCastlePosition(type, this.state.pos);
    if(!hasPosition) this.state.castle[type] = false;

    return !hasPosition;
}

export function getEnPassantTargets() {
    const targets = Editor.getEnPassantTargets(this.state.move, this.state.pos);
    const squares = targets.map(square => `${File.labelOf(square.file)}${square.rank}`);

    const idx = squares.findIndex(val => val === this.state.enPassant);
    if(idx === -1) this.state.enPassant = "";

    return squares;
}


/* State */
export function isSameState() {
    const ref = this.initial;
    const state = this.state;

    return state.id === ref.id && state.clock.halfmove === ref.clock.halfmove &&
        state.clock.fullmove === ref.clock.fullmove;
}


/* FEN */
const fenParam = "fen";


export function generateFEN() {
    const fen = Common.generateFEN(this.state);
    const id = Common.getStateId(fen);
    this.state.id = id;
    
    if(this.isSameState()) Common.deleteQueryParam(fenParam);
    else Common.setQueryParam(fenParam, fen);

    return fen;
}

export function loadFEN(str) {
    try {
        Common.loadFEN(str);
        // TODO: Replace castle, en passant, and clock invalid values
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
    Common.replacePiece(destId, piece, this.state.pos);

    // Remove piece in src if not tray
    if(!Common.fromTray(srcId)) Common.removePiece(srcId, this.state.pos);
}

export function onDropRemove(ev) {
    // Get dragged piece id
    const srcId = Common.dropGetId(ev);

    // Remove piece if src is not tray
    if(!Common.fromTray(srcId)) Common.removePiece(srcId, this.state.pos);
}


/* Lifecycle */
export function created() {
    this.state = State.New();
    this.state.id = Common.getStateId(Common.generateFEN(this.state));

    this.initial = {
        clock: {...this.state.clock},
        id: this.state.id,
    };
}

// TODO: If url has FEN query param, load FEN
// Maybe put in created()?
