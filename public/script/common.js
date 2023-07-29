import * as Chess from '../module/game.js';

export const none = ".";
const mime = "text/plain";

const game = new Chess.Game();

export const vue = {
    data: {
        board: game.getPosition(),
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
                return this.getPiece(rank, file) === none
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
            clearBoard() {
                this.board = Array(8).fill(Array(8).fill(none));
            },
            resetBoard() {
                game.resetPosition();
                this.board = game.getPosition();
                this.flipped = false;
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
                this.setPiece(data.rank, data.file, none);
            },
        },
    },
};