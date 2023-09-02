import * as Common from './common.js';
import * as Setup from '../module/setup.js';
import * as Position from '../module/position.js';
import * as FEN from '../module/fen.js';
import * as Loc from '../module/location.js';
import * as Pieces from '../module/pieces.js';
import * as Castles from '../module/castles.js';
import * as AbstractPieces from '../module/abstract-pieces.js';
import { White, Black } from '../module/color.js';
import { Game } from '../module/analysis.js';
import * as Err from '../module/error.js';
import * as Face from './face.js';


const game = new Game();


/* Color */
export function white() {
    return White;
}

export function black() {
    return Black;
}


/* Tray */
const whitePieces = Object.freeze(Pieces.getByColor(White)).map(piece => piece.letter);
const blackPieces = Object.freeze(Pieces.getByColor(Black)).map(piece => piece.letter);


export function getTrayPieceIdx() {
    return [...Array(AbstractPieces.getList().length).keys()];
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
    return Common.isEmpty(this.state.pos, Loc.of(file, rank));
}

export function getPiece(rank, file) {
    return Common.getPiece(this.state.pos, Loc.of(file, rank));
}

export function flipBoard() {
    this.flip = !this.flip;
}

export function clearBoard() {
    this.updateState({pos: Setup.emptySetup()});
}

export function resetBoard() {
    game.resetSetup();
    this.state = game.getSetupData();
    this.flip = false;
}


/* Form */
export function getWhiteCastleTypes() {
    return Castles.getByColor(White);
}

export function getBlackCastleTypes() {
    return Castles.getByColor(Black);
}

export function selectedMove(color) {
    return this.state.move === color;
}

export function setMove(ev) {
    this.updateState({move: ev.target.value});
}

export function setCastle(ev) {
    const type = ev.target.value;
    const value = ev.target.checked;

    let rights = {...this.state.castle};
    rights[type] = value;
    this.updateState({castle: rights});
}

export function disableCastle(type) {
    const castle = Castles.get(type);
    const king = castle.king;
    const rook = castle.rook;

    return Common.getPiece(this.state.pos, king.from) !== king.piece ||
        Common.getPiece(this.state.pos, rook.from) !== rook.piece;
}


/* State */
export function isDefaultState() {
    const ref = this.stateDefault;
    const state = this.state;

    return state.id === ref.id && state.clock.halfmove === ref.clock.halfmove &&
        state.clock.fullmove === ref.clock.fullmove;
}

export function updateState(keys) {
    let state = {...this.state};
    for(const key in keys) state[key] = keys[key];

    game.loadSetup(state);
    this.state = game.getSetupData();
}

export function validSetup() {
    try {
        game.validateSetup();
    }
    catch(err) {
        console.log(Err.str(err));
        return false;
    }

    return true;
}


/* FEN */
const paramFEN = "fen";

export function getFEN() {
    if(this.isDefaultState()) Common.deleteQuery(paramFEN);
    else Common.setQuery(paramFEN, this.state.fen);

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
        this.updateState();
    }
}

export function copyFEN(ev) {
    const fen = Common.getElement("fen").value;
    navigator.clipboard.writeText(fen);
    
    console.log("FEN copied");
}

export function onChangeFEN(ev) {
    this.loadFEN(ev.target.value);
}


/* Submit */
export function onSubmit(ev) {
    let query = {};

    if(!this.isDefaultState()) {
        query = {import: paramFEN, [paramFEN]: Common.getQuery(paramFEN)};
    }
    Common.openURL("/analysis", query);
}


/* Drag and drop */
export function fromTray(id) {
    return id.includes("tray");
}

export function getDraggedPiece(id) {
    try {
        if(fromTray(id)) return Common.getPieceType(id);
        else return Common.getPiece(this.state.pos, Common.getLoc(id));
    }
    catch(err) {
        Face.disapprove();
    }
}

export function onDragStart(ev) {
    Common.dragSetId(ev, ev.target.id);
}

export function onDropReplaceOrCopy(ev) {
    const srcId = Common.dropGetId(ev);
    const destId = ev.target.id;

    // Return if dnd to self
    if(srcId === destId) return;
    
    // Replace piece in dest
    const piece = this.getDraggedPiece(srcId);

    let pos = Position.copy(this.state.pos);
    Common.replacePieceById(destId, piece, pos);

    // Remove piece in src if not tray
    if(!fromTray(srcId)) Common.removePieceById(srcId, pos);
    this.updateState({pos: pos});
}

export function onDropRemove(ev) {
    // Get dragged piece id
    const srcId = Common.dropGetId(ev);

    // Remove piece if src is not tray
    if(!fromTray(srcId)) {
        let pos = Position.copy(this.state.pos);
        
        Common.removePieceById(srcId, pos);
        this.updateState({pos: pos});
    }
}


/* Lifecycle */
export function created() {
    const setup = game.getSetupData();
    this.stateDefault = {
        clock: {...setup.clock},
        id: setup.id,
    };

    const fen = Common.getQuery(paramFEN);
    if(fen) {
        try {
            game.loadSetup(FEN.load(fen));
        }
        catch(err) {
            console.log(Err.str(err));
            game.resetSetup();
        }
    }

    this.state = game.getSetupData();
}
