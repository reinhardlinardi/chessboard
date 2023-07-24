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
            onDrop(ev) {
                // Get dragged item id
                const id = ev.dataTransfer.getData("text/plain");
                let el = document.getElementById(id);
                
                // If drop zone id not "bin" move item and update image src, else remove
                if(ev.target.id !== "bin") {
                    ev.target.appendChild(document.getElementById(id));
                    ev.target.src = el.src;
                } else {
                    el.parentNode.removeChild(el);
                }
            }
        }
    },
};