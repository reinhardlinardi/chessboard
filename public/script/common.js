import * as Chess from '../module/game.js';

const game = new Chess.Game();
const none = ".";

export default {
    data: {
        board: [],
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
            isDarkSquare(rank, file) {
                return (rank + file) % 2 === 0? true : false;
            },
        },
        board: {
            getPiece(rank, file) {
                return this.board[rank][file];
            },
            setPiece(rank, file, piece) {
                this.board[rank][file] = piece;
            },
            clearBoard() {
                for(let rank = 0; rank < 8; rank++) {
                    for(let file = 0; file < 8; file++) {
                        this.setPiece(rank, file, none);
                    }
                }
            },
            flipBoard() {
                this.flipped = !this.flipped;
            },
            resetBoard() {
                game.resetPosition();
                this.reloadBoard();
            },
            reloadBoard() {
                this.board = game.getPosition();
            },
        },
        /* Drag and drop */
        dnd: {
            fromTray(id) {
                return id.includes("tray");
            },
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
                const piece = (fromTray)? srcData.pieceType : this.getPiece(srcData.rank, srcData.file);

                // Replace piece in dest
                this.setPiece(destData.rank, destData.file, piece);
                // If not from tray, delete piece from src
                if(!fromTray) {
                    this.setPiece(srcData.rank, srcData.file, none);
                }
            },
            onDropRemove(ev) {
                // Get dragged item id
                const srcId = ev.dataTransfer.getData("text/plain");
                const srcData = document.getElementById(srcId).dataset;
                const fromTray = this.fromTray(srcId);

                // Remove item only if src is not tray
                if(!fromTray) {
                    this.setPiece(srcData.rank, srcData.file, none);
                }
            },
        },
        lifecycle: {
            created() {
                this.reloadBoard();
            },
        },
    },
};