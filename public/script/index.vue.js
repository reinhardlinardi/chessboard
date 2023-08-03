import { createApp } from '../lib/vue.esm-browser.js';

import * as Color from '../module/color.js';
import * as Setup from '../module/setup.js';

import common from './common.js';
import * as page from './index.js';

// Root component
const component = {
    data() {
        return {
            board: Setup.defaultSetup(),
            flipped: false,
            form: {
                move: Color.White,
                castle: page.castleOptions,
                enPassant: "",
            },
        }
    },
    computed: {
        fen: page.fen.generateFEN,
    },
    methods: {
        getElement: common.dom.getElement,
        getElementData: common.dom.getElementData,

        rankOf: common.render.rankOf,
        fileOf: common.render.fileOf,
        labelOf: common.render.labelOf,
        isEmpty: common.render.isEmpty,
        getTrayPieceIdx: page.render.getTrayPieceIdx,
        getTopTrayPiece: page.render.getTopTrayPiece,
        getBottomTrayPiece: page.render.getBottomTrayPiece,
        getWhiteCastleTypes: page.render.getWhiteCastleTypes,
        getBlackCastleTypes: page.render.getBlackCastleTypes,

        whiteColor: page.option.whiteColor,
        blackColor: page.option.blackColor,
        setCastle: page.option.setCastle,
        disableCastle: page.option.disableCastle,
        getEnPassantTargets: page.option.getEnPassantTargets,

        loadFEN: page.fen.loadFEN,

        getPiece: common.board.getPiece,
        setPiece: common.board.setPiece,
        flipBoard: common.board.flipBoard,
        resetBoard: page.board.resetBoard,
        clearBoard: page.board.clearBoard,

        fromTray: common.dnd.fromTray,
        dragSetId: common.dnd.dragSetId,
        dropGetId: common.dnd.dropGetId,
        getDraggedPiece: common.dnd.getDraggedPiece,
        replacePiece: common.dnd.replacePiece,
        removePiece: common.dnd.removePiece,
        onDragStart: page.dnd.onDragStart,
        onDropReplaceOrCopy: page.dnd.onDropReplaceOrCopy,
        onDropRemove: page.dnd.onDropRemove,
    },
};

// Setup vue
const app = createApp(component);
app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount('#app');
