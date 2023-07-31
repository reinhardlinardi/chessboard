import * as Piece from '../module/piece.js';
import * as Color from '../module/color.js';
import * as Castle from '../module/castle.js';

import * as Editor from '../module/editor.js';


export const editor = new Editor.Editor();
editor.setDefaultSetup();


export const topTray = Piece.getTypes(Color.Black).map(piece => piece.letter);
export const bottomTray = Piece.getTypes(Color.White).map(piece => piece.letter);


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
    getWhiteCastleOptions() {
        return Castle.getTypes(Color.White);
    },
    getBlackCastleOptions() {
        return Castle.getTypes(Color.Black);
    },
};

export const board = {
    resetBoard() {
        editor.setDefaultSetup();
        this.setBoard(editor.getPosition());
        this.flipped = false;
    },
    clearBoard() {
        editor.clear();
        this.setBoard(editor.getPosition());
    },
};

/* Drag and drop */
export const dnd = {
    replacePiece(id, piece) {
        let data = this.getElementData(id);
        editor.setPiece(data.rank, data.file, piece);
        this.setPiece(data.rank, data.file, piece);
    },
    removePiece(id) {
        let data = this.getElementData(id);
        editor.setPiece(data.rank, data.file, Piece.None);
        this.setPiece(data.rank, data.file, Piece.None);
    },
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
        this.replacePiece(destId, piece);

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