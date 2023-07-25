import { createApp } from '../lib/vue.esm-browser.js';
import Common from './common.js';

// Root component
let component = {
    data() {
        return {
            board: Common.data.board,
        }
    },
    methods: {
        toRank: Common.methods.util.toRank,
        isPiece: Common.methods.util.isPiece,
        isDarkSquared: Common.methods.util.isDarkSquared,
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
