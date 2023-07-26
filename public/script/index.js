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
        isDarkSquare: Common.methods.util.isDarkSquare,
        getPiece: Common.methods.util.getPiece,
        isEmpty: Common.methods.util.isEmpty,
        fromTray: Common.methods.util.fromTray,
        onDragStart: Common.methods.handler.onDragStart,
        onDropReplaceOrCopy: Common.methods.handler.onDropReplaceOrCopy,
        onDropRemove: Common.methods.handler.onDropRemove,
    }
};

// Setup vue
const app = createApp(component);
app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount('#app');
