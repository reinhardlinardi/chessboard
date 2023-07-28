import { createApp } from '../lib/vue.esm-browser.js';
import Common from './common.js';

// Root component
const component = {
    data() {
        return {
            board: Common.data.board,
            flipped: Common.data.flipped,
        }
    },
    methods: {
        toRank: Common.methods.render.toRank,
        toFile: Common.methods.render.toFile,
        isEmpty: Common.methods.render.isEmpty,
        isDarkSquare: Common.methods.render.isDarkSquare,
        getPiece: Common.methods.board.getPiece,
        setPiece: Common.methods.board.setPiece,
        clearBoard: Common.methods.board.clearBoard,
        flipBoard: Common.methods.board.flipBoard,
        resetBoard: Common.methods.board.resetBoard,
        reloadBoard: Common.methods.board.reloadBoard,
        fromTray: Common.methods.dnd.fromTray,
        onDragStart: Common.methods.dnd.onDragStart,
        onDropReplaceOrCopy: Common.methods.dnd.onDropReplaceOrCopy,
        onDropRemove: Common.methods.dnd.onDropRemove,
    },
    created: Common.methods.lifecycle.created,
};

// Setup vue
const app = createApp(component);
app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount('#app');
