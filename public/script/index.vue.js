import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import * as page from './index.js';

// Root component
const component = {
    data() {
        return {
            state: {},
            flip: false,
            stateDefault: {
                clock: {},
                id: "",
            },
        }
    },
    computed: {
        fen: page.getFEN,
        validSetup: page.validSetup,
    },
    methods: {
        white: page.white,
        black: page.black,

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
        
        getWhiteCastleTypes: page.getWhiteCastleTypes,
        getBlackCastleTypes: page.getBlackCastleTypes,
        
        selectedMove: page.selectedMove,
        setMove: page.setMove,
        setCastle: page.setCastle,
        disableCastle: page.disableCastle,

        isDefaultState: page.isDefaultState,
        updateState: page.updateState,

        loadFEN: page.loadFEN,
        copyFEN: page.copyFEN,
        onChangeFEN: page.onChangeFEN,

        onSubmit: page.onSubmit,

        getDraggedPiece: page.getDraggedPiece,
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
