import { createApp } from '../lib/vue.esm-browser.js';

import common from './common.vue.js';
import * as page from './index.js';

// Root component
const component = {
    data() {
        return {
            board: common.data.board,
            flipped: common.data.flipped,
            form: {
                whiteToMove: true,
                castle: [],
            },
        }
    },
    methods: {
        getElement: common.methods.dom.getElement,
        getElementData: common.methods.dom.getElementData,

        rankOf: common.methods.render.rankOf,
        fileOf: common.methods.render.fileOf,
        labelOf: common.methods.render.labelOf,
        isEmpty: common.methods.render.isEmpty,
        getTrayPieceIdx: page.render.getTrayPieceIdx,
        getTopTrayPiece: page.render.getTopTrayPiece,
        getBottomTrayPiece: page.render.getBottomTrayPiece,
        getWhiteCastleOptions: page.render.getWhiteCastleOptions,
        getBlackCastleOptions: page.render.getBlackCastleOptions,

        getPiece: common.methods.board.getPiece,
        setPiece: common.methods.board.setPiece,
        flipBoard: common.methods.board.flipBoard,
        clearBoard: page.board.clearBoard,
        resetBoard: page.board.resetBoard,

        fromTray: common.methods.dnd.fromTray,
        dragSetId: common.methods.dnd.dragSetId,
        dropGetId: common.methods.dnd.dropGetId,
        getDraggedPiece: common.methods.dnd.getDraggedPiece,
        replacePiece: common.methods.dnd.replacePiece,
        removePiece: common.methods.dnd.removePiece,
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
