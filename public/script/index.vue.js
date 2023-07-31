import { createApp } from '../lib/vue.esm-browser.js';

import common from './common.vue.js';
import * as page from './index.js';

// Root component
const component = {
    data() {
        return {
            board: page.editor.getPosition(),
            flipped: false,
            form: {
                whiteToMove: true,
                castle: [],
            },
        }
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
        getWhiteCastleOptions: page.render.getWhiteCastleOptions,
        getBlackCastleOptions: page.render.getBlackCastleOptions,

        getPiece: common.board.getPiece,
        setPiece: common.board.setPiece,
        setBoard: common.board.setBoard,
        flipBoard: common.board.flipBoard,
        resetBoard: page.board.resetBoard,
        clearBoard: page.board.clearBoard,

        fromTray: common.dnd.fromTray,
        dragSetId: common.dnd.dragSetId,
        dropGetId: common.dnd.dropGetId,
        getDraggedPiece: common.dnd.getDraggedPiece,
        replacePiece: page.dnd.replacePiece,
        removePiece: page.dnd.removePiece,
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
