import * as Chess from '../module/game.js';

const game = new Chess.Game();
const none = ".";

export default {
    data: {
        board: [],
    },
    methods: {
        util: {
            /* Rendering */
            isLightSquare(rank, file) {
                return (rank + file) % 2 === 0? true : false;
            },
            isEmpty(rank, file) {
                return this.getPiece(rank, file) === none
            },
            getPiece(rank, file) {
                return this.board[rank][file];
            },
            /* Drag and drop */
            fromTray(id) {
                return id.includes("tray");
            },
        },
        board: {
            updateBoard() {
                this.board = game.getPosition().reverse();
            },
            /* Board controls */
            clearBoard() {
                for(let rank = 0; rank < 8; rank++) {
                    for(let file = 0; file < 8; file++) {
                        this.board[rank][file] = none;
                    }
                }
            },
            resetBoard() {
                game.resetPosition();
                this.updateBoard();
            },
        },
        handler: {
            /* Drag and drop */
            onDragStart(ev) {
                // Save dragged item id
                ev.dataTransfer.setData("text/plain", ev.target.id);
                // Allow copy or move data
                ev.dataTransfer.effectAllowed = "copyMove";
            },
            onDropReplaceOrCopy(ev) {
                // Get dragged item id
                const srcId = ev.dataTransfer.getData("text/plain");
                const destId = ev.target.id;

                // Prevent drag and drop to self to supress errors
                if(srcId === destId) return;
                
                // Get piece type from data-* attribute
                const srcData = document.getElementById(srcId).dataset;
                const destData = document.getElementById(destId).dataset;

                const fromTray = this.fromTray(srcId);
                const piece = (fromTray)? srcData.pieceType : this.board[srcData.rank][srcData.file];

                // Replace piece in dest
                this.board[destData.rank][destData.file] = piece;
                // If not from tray, delete piece from src
                if(!fromTray) {
                    this.board[srcData.rank][srcData.file] = none;
                }
            },
            onDropRemove(ev) {
                // Get dragged item id
                const srcId = ev.dataTransfer.getData("text/plain");
                const srcData = document.getElementById(srcId).dataset;
                const fromTray = this.fromTray(srcId);

                // Remove item only if src is not tray
                if(fromTray) return;
                
                this.board[srcData.rank][srcData.file] = none;
            },
        },
        lifecycle: {
            created() {
                this.updateBoard();
            },
        },
    },
};