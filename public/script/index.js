import * as Common from './common.js';
import * as Setup from '../module/setup.js';
import * as Position from '../module/position.js';
import * as FEN from '../module/fen.js';
import * as Piece from '../module/piece.js';
import * as Pieces from '../module/pieces.js';
import * as Castles from '../module/castles.js';
import { White, Black } from '../module/color.js';
import { Game } from '../module/analysis.js';
import * as Err from '../module/error.js';


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

export function topTrayPieces() {
    return this.flip? [...whitePieces] : [...blackPieces];
}

export function bottomTrayPieces() {
    return this.flip? [...blackPieces] : [...whitePieces];
}

export function isClicked(piece) {
    if(!this.select.click) return false;
    return Common.getTrayPiece(this.select.id) === piece;
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

export function locOf(y, x) {
    return Common.locOf(y, x, this.flip);
}

export function isEmpty(loc) {
    return Common.isEmpty(this.setup.pos, loc);
}

export function getPiece(loc) {
    return Common.getPiece(this.setup.pos, loc);
}

export function flipBoard() {
    this.flip = !this.flip;
}

export function clearBoard() {
    this.updateSetup({pos: Setup.emptySetup()});
}

export function resetBoard() {
    game.resetSetup();
    this.setup = game.getSetupData();
    this.flip = false;
}

function replacePiece(loc, piece, board) {
    Common.setPiece(piece, board, loc);
}

function removePiece(loc, board) {
    Common.setPiece(Piece.None, board, loc);
}


/* Form */
export function getCastleTypes(color) {
    return Castles.getByColor(color);
}

export function isNextToMove(color) {
    return this.setup.move === color;
}

export function setNextToMove(ev) {
    this.updateSetup({move: ev.target.value});
}

export function setCastle(ev) {
    const type = ev.target.value;
    const value = ev.target.checked;

    let rights = {...this.setup.castle};
    rights[type] = value;
    this.updateSetup({castle: rights});
}

export function disableCastle(type) {
    const castle = Castles.get(type);
    const king = castle.king;
    const rook = castle.rook;

    return Common.getPiece(this.setup.pos, king.from) !== king.piece ||
        Common.getPiece(this.setup.pos, rook.from) !== rook.piece;
}


/* State */
export function isDefaultSetup() {
    const ref = this.ref;
    const setup = this.setup;

    return setup.id === ref.id && setup.clock.halfmove === ref.clock.halfmove &&
        setup.clock.fullmove === ref.clock.fullmove;
}

export function updateSetup(keys) {
    let setup = {...this.setup};
    for(const key in keys) setup[key] = keys[key];

    game.loadSetup(setup);
    this.setup = game.getSetupData();
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
    if(this.isDefaultSetup()) Common.deleteQuery(paramFEN);
    else Common.setQuery(paramFEN, this.setup.fen);

    return this.setup.fen;
}

export function loadFEN(fen) {
    let setup;
    
    try {
        setup = FEN.load(fen);
        this.updateSetup(setup);
    }
    catch(err) {
        console.log(Err.str(err));
        this.updateSetup();
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

    if(!this.isDefaultSetup()) {
        query = {import: paramFEN, [paramFEN]: Common.getQuery(paramFEN)};
    }
    Common.openURL("/analysis", query);
}


/* Selection */
export function getSelectedPiece(id, fromTray) {
    try {
        const pos = this.setup.pos;
        return fromTray? Common.getTrayPiece(id) : Common.getPiece(pos, Common.getLoc(id));
    }
    catch(err) {
        return null;
    }
}

export function onDropReplaceOrCopy(ev) {
    if(this.select.click) return;

    const src = this.select.id;
    const dest = ev.target.id;
    const fromTray = this.select.tray;

    this.select = {click: false, tray: false, id: ""};
    
    if(src === dest) return;

    const piece = this.getSelectedPiece(src, fromTray);
    if(piece === null) return;
    
    const updated = Position.copy(this.setup.pos);
    const from = Common.getLoc(src);
    const to = Common.getLoc(dest);

    if(!fromTray) removePiece(from, updated);
    replacePiece(to, piece, updated);

    this.updateSetup({pos: updated});
}

export function onDropRemove(ev) {
    if(this.select.click) return;

    const src = this.select.id;
    const fromTray = this.select.tray;

    this.select = {click: false, tray: false, id: ""};
    
    if(fromTray) return;
    const _ = this.getSelectedPiece(src, fromTray);

    const updated = Position.copy(this.setup.pos); 
    const from = Common.getLoc(src);

    removePiece(from, updated);

    this.updateSetup({pos: updated});
}

export function onDragStartTray(ev) {
    if(!this.select.click) this.select = {click: false, tray: true, id: ev.target.id};
}

export function onDragStartBoard(ev) {
    if(!this.select.click) this.select = {click: false, tray: false, id: ev.target.id};
}

export function onClickTray(ev) {
    if(this.select.id === ev.target.id) this.select = {click: false, tray: false, id: ""};
    else this.select = {click: true, tray: true, id: ev.target.id};
}

export function onClickBoard(ev) {
    if(!this.select.click) return;

    const piece = Common.getTrayPiece(this.select.id);
    const loc = Common.getLoc(ev.target.id);

    const updated = Position.copy(this.setup.pos);

    if(Common.getPiece(this.setup.pos, loc) === piece) removePiece(loc, updated);
    else replacePiece(loc, piece, updated);
    
    this.updateSetup({pos: updated});
}

export function resetClick(ev) {
    this.select = {click: false, tray: false, id: ""};
}


/* Lifecycle */
export function created() {
    const setup = game.getSetupData();
    this.ref = {clock: {...setup.clock}, id: setup.id};

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

    this.setup = game.getSetupData();
}
