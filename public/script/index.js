import * as Setup from '../module/setup.js';
import * as Piece from '../module/piece.js';
import * as Color from '../module/color.js';
import * as Castle from '../module/castle.js';
import * as Editor from '../module/editor.js';
import * as File from '../module/file.js';
import * as FEN from '../module/fen.js';


const w = Color.White;
const b = Color.Black;

export const topTray = Piece.getByColor(b).map(piece => piece.letter);
export const bottomTray = Piece.getByColor(w).map(piece => piece.letter);

export const render = {
    getTrayPieceIdx() {
        return [...Array(6).keys()];
    },
    getTopTrayPiece(idx) {
        return this.flipped? bottomTray[idx]: topTray[idx];  
    },
    getBottomTrayPiece(idx) {
        return this.flipped? topTray[idx]: bottomTray[idx];
    },
    getWhiteCastleTypes() {
        return Castle.getByColor(w);
    },
    getBlackCastleTypes() {
        return Castle.getByColor(b);
    },
};

export const castleOptions = [...Castle.getByColor(w), ...Castle.getByColor(b)]
    .map(castle => castle.letter)
    .reduce((opt, type) => ({...opt, [type]: false}), {});

export const option = {
    whiteColor() {
        return w;
    },
    blackColor() {
        return b;
    },
    setCastle(ev) {
        const data = this.getElementData(ev.target.id);
        const type = data.castleType;
        const value = ev.target.checked;

        this.form.castle[type] = value;
    },
    disableCastle(type) {
        const enabled = Editor.hasCastlePosition(type, this.board);
        if(!enabled) this.form.castle[type] = false;

        return !enabled;
    },
    getEnPassantTargets() {
        const targets = Editor.getEnPassantTargets(this.form.move, this.board);
        const squares = targets.map(square => `${File.labelOf(square.file)}${square.rank}`);

        const idx = squares.findIndex(val => val === this.form.enPassant);
        if(idx === -1) this.form.enPassant = "";

        return squares;
    },
};

export const fen = {
    generateFEN() {
        const castle = Object.keys(this.form.castle).filter(type => this.form.castle[type]);
        return FEN.Generate(this.board, this.form.move, castle, this.form.enPassant, this.clock);
    },
    loadFEN(ev) {
        // console.log("Load FEN", ev.target.value);
    },
};

export const board = {
    resetBoard() {
        this.board = Setup.defaultSetup();
        this.flipped = false;
    },
    clearBoard() {
        this.board = Setup.emptySetup();
    },
};

/* Drag and drop */
export const dnd = {
    onDragStart(ev) {
        this.dragSetId(ev, ev.target.id);
    },
    onDropReplaceOrCopy(ev) {
        const srcId = this.dropGetId(ev);
        const destId = ev.target.id;

        // Return if src not valid or dnd to self
        if(srcId === "" || srcId === destId) return;
        
        // Replace piece in dest
        const piece = this.getDraggedPiece(srcId);
        this.replacePiece(piece, destId);

        // Remove piece in src if not tray
        if(!this.fromTray(srcId)) this.removePiece(srcId);
    },
    onDropRemove(ev) {
        // Get dragged piece id
        const srcId = this.dropGetId(ev);

        // Remove piece if src is not tray
        if(!this.fromTray(srcId))  this.removePiece(srcId);
    },
};