export default {
    data: {
        // TODO: Do not hardcode
        board: [
            "rnbqkbnr".split(""),
            "pppppppp".split(""),
            "........".split(""),
            "........".split(""),
            "........".split(""),
            "........".split(""),
            "PPPPPPPP".split(""),
            "RNBQKBNR".split(""),
        ],
    },
    methods: {
        util: {
            isLightSquare(rank, file) {
                return (rank + file) % 2 === 0? true : false;
            },
            getPiece(rank, file) {
                return this.board[rank][file];
            },
            isEmpty(rank, file) {
                return this.getPiece(rank, file) == ".";
            },
            fromTray(id) {
                return id.includes("tray");
            }
        },
        handler: {
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
                if(srcId === destId) {
                    return;
                }
                
                // Get piece type from data-* attribute
                const srcData = document.getElementById(srcId).dataset;
                const destData = document.getElementById(destId).dataset;

                const fromTray = this.fromTray(srcId);
                const piece = (fromTray)? srcData.pieceType : this.board[srcData.rank][srcData.file];

                // Replace piece in dest
                this.board[destData.rank][destData.file] = piece;
                // If not from tray, delete piece from src
                if(!fromTray) {
                    this.board[srcData.rank][srcData.file] = ".";
                }
            },
            onDropRemove(ev) {
                // Get dragged item id
                const srcId = ev.dataTransfer.getData("text/plain");
                const srcData = document.getElementById(srcId).dataset;
                const fromTray = this.fromTray(srcId);

                // Remove item only if src is not tray
                if(!fromTray) {
                    this.board[srcData.rank][srcData.file] = ".";
                }
            },
        },
    },
};