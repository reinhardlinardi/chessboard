import * as Piece from '../module/piece.js';
import * as Color from '../module/color.js';
import * as Setup from '../module/setup.js';
import * as Castle from '../module/castle.js';

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
    clearBoard() {
        this.board = Array(8).fill(
            Array(8).fill(Piece.None)
        );
    },
    resetBoard() {
        this.board = Setup.getDefaultSetup();
        this.flipped = false;
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
