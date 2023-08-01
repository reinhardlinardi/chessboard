import * as Setup from '../module/setup.js';
import * as Piece from '../module/piece.js';
import * as Color from '../module/color.js';
import * as Castle from '../module/castle.js';
import * as Editor from '../module/editor.js';

import common from './common.js';

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
    getWhiteCastleTypes() {
        return Castle.getTypes(Color.White);
    },
    getBlackCastleTypes() {
        return Castle.getTypes(Color.Black);
    },
};

export const option = {
    whiteColor() {
        return Color.White;
    },
    blackColor() {
        return Color.Black;
    },
    setCastle(ev) {
        const data = common.dom.getElementData(ev.target.id);
        const type = data.castleType;
        const value = ev.target.checked;

        this.form.castle[type] = value;
    },
    disableCastle(type) {
        const enabled = Editor.hasCastlePosition(this.board, type);
        this.form.castle[type] = enabled;

        return !enabled;
    },
}

export const board = {
    resetBoard() {
        this.board = Setup.getDefaultSetup();
        this.flipped = false;
    },
    clearBoard() {
        this.board = Setup.getEmptySetup();
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