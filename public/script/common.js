import * as Setup from '../module/setup.js';
import * as Piece from '../module/piece.js';

const mime = "text/plain";

export const vue = {
    data: {
        board: Setup.getDefaultSetup(),
        flipped: false,
    },
    methods: {
        render: {
            toRank(y) {
                return this.flipped? y: 7-y;
            },
            toFile(x) {
                return this.flipped? 7-x: x;
            },
            isEmpty(rank, file) {
                return this.getPiece(rank, file) === Piece.None;
            },
        },
        board: {
            getPiece(rank, file) {
                return this.board[rank][file];
            },
            setPiece(rank, file, piece) {
                this.board[rank][file] = piece;
            },
            flipBoard() {
                this.flipped = !this.flipped;
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
                // JS gives "\r\n" id when we drag from empty square, so we trim id to get "" for invalid id
                return dnd.getData(mime).trim();
            },
            getDraggedPiece(id) {
                let data = this.getElementData(id);
                return this.fromTray(id)? data.pieceType: this.getPiece(data.rank, data.file);
            },
            replacePiece(id, piece) {
                let data = this.getElementData(id);
                this.setPiece(data.rank, data.file, piece);
            },
            removePiece(id) {
                let data = this.getElementData(id);
                this.setPiece(data.rank, data.file, Piece.None);
            },
        },
    },
};