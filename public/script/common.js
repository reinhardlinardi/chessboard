import Board from '../module/board.js';

export default {
    data: {
        board: new Board(),
        size: Board.size,
    },
    methods: {
        toRank(inverseRank) {
            return this.size-inverseRank-1;
        },
        isPiece(piece) {
            return piece !== ""
        },
        isDarkSquared(rank, file) {
            return (rank+file)%2 === 0? true : false;
        },
        getPosition() {
            return this.board.getPosition().reverse();
        },
    },
};