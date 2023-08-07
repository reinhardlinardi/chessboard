import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import * as page from './index.js';

// Root component
const component = {
    data() {
        return {
            state: {},
            initial: {
                clock: {},
                id: "",
            },
            flip: false,
        }
    },
    computed: {
        fen: page.generateFEN,
    },
    methods: {
        getTrayPieceIdx: page.getTrayPieceIdx,
        getTopTrayPiece: page.getTopTrayPiece,
        getBottomTrayPiece: page.getBottomTrayPiece,
        
        rankOf: page.rankOf,
        fileOf: page.fileOf,
        labelOf: page.labelOf,
        isEmpty: page.isEmpty,
        getPiece: page.getPiece,

        flipBoard: page.flipBoard,
        clearBoard: page.clearBoard,
        resetBoard: page.resetBoard,

        whiteColor: page.whiteColor,
        blackColor: page.blackColor,
        getWhiteCastleTypes: page.getWhiteCastleTypes,
        getBlackCastleTypes: page.getBlackCastleTypes,
        
        setCastle: page.setCastle,
        disableCastle: page.disableCastle,
        getEnPassantTargets: page.getEnPassantTargets,

        isSameState: page.isSameState,
        loadFEN: page.loadFEN,

        onChangeFEN: page.onChangeFEN,

        onDragStart: page.onDragStart,
        onDropReplaceOrCopy: page.onDropReplaceOrCopy,
        onDropRemove: page.onDropRemove,
    },
    created: page.created,
};

// Setup vue
const app = createApp(component);
app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount('#app');
