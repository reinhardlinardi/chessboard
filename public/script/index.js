import * as Common from './common.js';
import * as Setup from '../module/setup.js';
import * as Position from '../module/position.js';
import * as FEN from '../module/fen.js';
import * as Piece from '../module/piece.js';
import * as Pieces from '../module/pieces.js';
import * as Castles from '../module/castles.js';
import { Game } from '../module/analysis.js';
import { White, Black, getList as getColors } from '../module/color.js';
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
    return this.color === White? [...blackPieces] : [...whitePieces];
}

export function bottomTrayPieces() {
    return this.color === White? [...whitePieces] : [...blackPieces];
}

export function isTraySelected(piece) {
    return this.select.tray? Common.getTrayPiece(this.select.id) === piece : false;
}


/* Board */
const paramColor = "color";

export function rankOf(y) {
    return Common.rankOf(y, this.color);
}

export function fileOf(x) {
    return Common.fileOf(x, this.color);
}

export function labelOf(x) {
    return Common.labelOf(x, this.color);
}

export function locOf(y, x) {
    return Common.locOf(y, x, this.color);
}

export function isEmpty(loc) {
    return Common.isEmpty(this.setup.pos, loc);
}

export function getPiece(loc) {
    return Common.getPiece(this.setup.pos, loc);
}

export function flipBoard() {
    this.color = this.color === White? Black : White;
    Common.setQuery(paramColor, this.color);
}

export function clearBoard() {
    this.updateSetup({pos: Setup.emptySetup()});
}

export function resetBoard() {
    game.resetSetup();
    this.setup = game.getSetupData();
    Common.deleteQuery(paramFEN);
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

    if(this.isDefaultSetup()) Common.deleteQuery(paramFEN);
    else Common.setQuery(paramFEN, this.fen);
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
const paramImport = "import";

export function onSubmit(ev) {
    let query = {color: this.color};

    if(!this.isDefaultSetup()) {
        query[paramImport] = paramFEN;
        query[paramFEN] = this.fen;
    }
    Common.openURL("../analysis", query);
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
    const src = this.select.id;
    const dest = ev.target.id;
    
    if(src === dest) return;
    
    const fromTray = this.select.tray;
    if(!fromTray) this.select.id = "";

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
    if(this.select.tray) return;

    const src = this.select.id;
    this.select.id = "";
    
    const piece = this.getSelectedPiece(src, false);
    if(piece === null) return;

    const updated = Position.copy(this.setup.pos); 
    const from = Common.getLoc(src);

    removePiece(from, updated);

    this.updateSetup({pos: updated});
}

export function onDragStartTray(ev) {
    this.select = {tray: true, id: ev.target.id};
}

export function onDragStartBoard(ev) {
    this.select = {tray: false, id: ev.target.id};
}

export function onClickTray(ev) {
    if(this.select.id === ev.target.id) this.select = {tray: false, id: ""};
    else this.select = {tray: true, id: ev.target.id};
}

export function onClickBoard(ev) {
    if(!this.select.tray) return;

    const piece = Common.getTrayPiece(this.select.id);
    const loc = Common.getLoc(ev.target.id);

    const updated = Position.copy(this.setup.pos);

    if(Common.getPiece(this.setup.pos, loc) === piece) removePiece(loc, updated);
    else replacePiece(loc, piece, updated);
    
    this.updateSetup({pos: updated});
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

    /* Query URL */
    Common.deleteQuery(paramFEN);

    const color = Common.getQuery(paramColor);
    this.color = color && getColors().includes(color)? color : White;
    Common.setQuery(paramColor, this.color);

    if(!this.isDefaultSetup()) Common.setQuery(paramFEN, this.fen);
}
