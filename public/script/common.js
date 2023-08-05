import * as Piece from '../module/piece.js';
import * as File from '../module/file.js';
import * as Position from '../module/position.js';


const _ = Piece.None;
const mime = "text/plain";

const q = new URLSearchParams(window.location.search);

export default {
    url: {
        hasQueryParam(name) {
            return q.has(name);
        },
        getQueryParam(name) {
            return q.get(name);
        },
        setQueryParam(name, value) {
            q.set(name, value);
            window.history.replaceState({}, "", `?${q.toString()}`);
        },
    },
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
            return this.getPiece(rank, file) === _;
        },
    },
    board: {
        getPiece(rank, file) {
            return Position.get(this.board, rank, file);
        },
        setPiece(piece, rank, file) {
            Position.set(piece, this.board, rank, file);
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
            const dnd = ev.dataTransfer;

            // Get dragged piece id
            // Id is "\r\n" when we drag from empty square, so trim is used to transform invalid id to ""
            return dnd.getData(mime).trim();
        },
        getDraggedPiece(id) {
            const data = this.getElementData(id);
            return this.fromTray(id)? data.pieceType: this.getPiece(data.rank, data.file);
        },
        replacePiece(piece, id) {
            const data = this.getElementData(id);
            this.setPiece(piece, data.rank, data.file);
        },
        removePiece(id) {
            const data = this.getElementData(id);
            this.setPiece(_, data.rank, data.file);
        },
    },
};
