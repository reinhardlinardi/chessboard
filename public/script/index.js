import { createApp } from '../lib/vue.esm-browser.js';
import Common from './common.js';

// Root component
const component = {
    data() {
        return {
            board: Common.data.board,
        }
    },
    methods: {
        isLightSquare: Common.methods.util.isLightSquare,
        getPiece: Common.methods.util.getPiece,
        isEmpty: Common.methods.util.isEmpty,
        fromTray: Common.methods.util.fromTray,
        updatePosition: Common.methods.game.updatePosition,
        onDragStart: Common.methods.handler.onDragStart,
        onDropReplaceOrCopy: Common.methods.handler.onDropReplaceOrCopy,
        onDropRemove: Common.methods.handler.onDropRemove,
    },
    created: Common.methods.lifecycle.created,
};

// Setup vue
const app = createApp(component);
app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount('#app');
