import Board from '../module/board.js';

export default {
    data: {
        board: new Board(),
        size: Board.size,
    },
    methods: {
        getPosition() {
            return this.board.getPosition().reverse();
        },
        getRank(inverseRank) {
            return this.size-inverseRank-1;
        },
        getFileLetter(file) {
            return Board.fileLetters[file];
        },
        isDarkSquared(inverseRank, file) {
            let rank = this.getRank(inverseRank);
            return (rank+file)%2 === 0? true : false;
        },
    },
};