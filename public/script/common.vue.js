import * as Piece from '../module/piece.js';
import * as File from '../module/file.js';

const mime = "text/plain";

export default {
    dom: {
        getElement(id) {
            return document.getElementById(id);
        },
        getElementData(id) {
            // Return data from data-* attribute
            return this.getElement(id).dataset;
        },
    },
    render: {
        rankOf(y) {
            return this.flipped? y+1: 8-y;
        },
        fileOf(x) {
            return this.flipped? 8-x: x+1;
        },
        labelOf(x) {
            return File.labelOf(this.fileOf(x));
        },
        isEmpty(rank, file) {
            return this.getPiece(rank, file) === Piece.None;
        },
    },
    board: {
        getPiece(rank, file) {
            return this.board[rank-1][file-1];
        },
        setPiece(rank, file, piece) {
            this.board[rank-1][file-1] = piece;
        },
        setBoard(position) {
            this.board = position;
        },
        flipBoard() {
            this.flipped = !this.flipped;
        },
    },
    /* Drag and drop */
    dnd: {
        fromTray(id) {
            return id.includes("tray");
        },
        dragSetId(ev, id) {
            let dnd = ev.dataTransfer;

            // Save dragged piece id
            dnd.setData(mime, id);
            // Allow copy or move piece
            dnd.effectAllowed = "copyMove";
        },
        dropGetId(ev) {
            let dnd = ev.dataTransfer;

            // Get dragged piece id
            // JS gives "\r\n" id when we drag from empty square, so we use trim to get "" for invalid id
            return dnd.getData(mime).trim();
        },
        getDraggedPiece(id) {
            let data = this.getElementData(id);
            return this.fromTray(id)? data.pieceType: this.getPiece(data.rank, data.file);
        },
    },
};