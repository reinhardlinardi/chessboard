import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import * as page from './index.js';

// Root component
const component = {
    data() {
        return {
            state: {},
            defaultState: {
                clock: {},
                id: "",
            },
            flip: false,
        }
    },
    computed: {
        fen: page.getFEN,
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

        white: page.white,
        black: page.black,
        getWhiteCastleTypes: page.getWhiteCastleTypes,
        getBlackCastleTypes: page.getBlackCastleTypes,
        
        selectedMove: page.selectedMove,
        setMove: page.setMove,
        setCastle: page.setCastle,

        isSameState: page.isSameState,
        updateState: page.updateState,

        loadFEN: page.loadFEN,
        onChangeFEN: page.onChangeFEN,

        disableSubmit: page.disableSubmit,
        onSubmit: page.onSubmit,

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
