import * as Setup from '../module/setup.js';
import * as Piece from '../module/piece.js';
import * as Color from '../module/color.js';
import * as Castle from '../module/castle.js';
import * as Editor from '../module/editor.js';


function pieceTypes(color) {
    return Piece.getTypes(color).map(piece => piece.letter);
}

function castleTypes(color) {
    return Castle.getTypes(color).map(castle => castle.letter);
}

export const topTray = pieceTypes(Color.Black);
export const bottomTray = pieceTypes(Color.White);

export const whiteCastle = castleTypes(Color.White);
export const blackCastle = castleTypes(Color.Black);


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

// export const option = {
//     checkboxClick(ev) {
//         console.log(ev.target.id);
//     },
//     isCastleDisabled(type) {
//         let disabled = !Editor.hasCastlePosition(this.board, type);
//         return disabled? true: null;
//     },
// }

export const board = {
    resetBoard() {
        this.setBoard(Setup.getDefaultSetup());
        this.flipped = false;
    },
    clearBoard() {
        this.setBoard(Setup.getEmptySetup());
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