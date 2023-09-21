import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import * as page from './index.js';

// Root component
const component = {
    data() {
        return {
            setup: {},
            flip: false,
            select: {
                click: false,
                tray: false,
                id: "",
            },
            ref: {},
        }
    },
    computed: {
        fen: page.getFEN,
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
        locOf: page.locOf,
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

        isDefaultSetup: page.isDefaultSetup,
        updateSetup: page.updateSetup,
        validSetup: page.validSetup,

        loadFEN: page.loadFEN,
        copyFEN: page.copyFEN,
        onChangeFEN: page.onChangeFEN,

        onSubmit: page.onSubmit,

        getSelectedPiece: page.getSelectedPiece,
        onDropReplaceOrCopy: page.onDropReplaceOrCopy,
        onDropRemove: page.onDropRemove,
        trayOnDragStart: page.trayOnDragStart,
        boardOnDragStart: page.boardOnDragStart,
        trayOnClick: page.trayOnClick,
        boardOnClick: page.boardOnClick,
    },
    created: page.created,
};

// Setup vue
const app = createApp(component);
app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount('#app');
