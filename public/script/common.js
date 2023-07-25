import Board from '../module/board.js';

export default {
    data: {
        board: new Board(),
        size: Board.size,
    },
    methods: {
        util: {
            toRank(inverseRank) { return this.size-inverseRank-1; },
            isPiece(piece) { return piece !== "" },
            isDarkSquared(rank, file) {
                return (rank+file)%2 === 0? true : false;
            },
        },
        board: {
            getPosition() {
                return this.board.getPosition().reverse();
            },
        },
        handler: {
            onDragStart(ev) {
                // Set data to dragged item id
                ev.dataTransfer.setData("text/plain", ev.target.id);
                ev.dataTransfer.effectAllowed = "move";
            },
            onDragOver(ev) {
                ev.dataTransfer.dropEffect = "move";
            },
            onDropReplace(ev) {
                // Get dragged item id
                const id = ev.dataTransfer.getData("text/plain");
                let el = document.getElementById(id);

                // Move item and update target image src
                ev.target.appendChild(el);
                ev.target.src = el.src;
                // TODO: Update data's board
            },
            onDropRemove(ev) {
                // Get dragged item id
                const id = ev.dataTransfer.getData("text/plain");
                let el = document.getElementById(id);

                // Remove item
                el.parentNode.removeChild(el);
                // TODO: Update data's board
            }
        }
    },
};