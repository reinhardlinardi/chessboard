import * as Common from './common.js';
import * as Setup from '../module/setup.js';
import * as Position from '../module/position.js';
import * as FEN from '../module/fen.js';
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


/* Form */
export function getWhiteCastleTypes() {
    return Castles.getByColor(White);
}

export function getBlackCastleTypes() {
    return Castles.getByColor(Black);
}

export function selectedMove(color) {
    return this.setup.move === color;
}

export function setMove(ev) {
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
    const ref = this.defaultSetup;
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


/* Drag and drop */
export function fromTray(id) {
    return id.includes("tray");
}

export function getDraggedPiece(id) {
    try {
        if(fromTray(id)) return Common.getPieceType(id);
        else return Common.getPiece(this.setup.pos, Common.getLoc(id));
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

    let pos = Position.copy(this.setup.pos);
    Common.replacePieceById(destId, piece, pos);

    // Remove piece in src if not tray
    if(!fromTray(srcId)) Common.removePieceById(srcId, pos);
    this.updateSetup({pos: pos});
}

export function onDropRemove(ev) {
    // Get dragged piece id
    const srcId = Common.dropGetId(ev);

    // Remove piece if src is not tray
    if(!fromTray(srcId)) {
        let pos = Position.copy(this.setup.pos);
        
        Common.removePieceById(srcId, pos);
        this.updateSetup({pos: pos});
    }
}


/* Lifecycle */
export function created() {
    const setup = game.getSetupData();
    this.defaultSetup = {clock: {...setup.clock}, id: setup.id};

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
