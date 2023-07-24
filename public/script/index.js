import { createApp } from '../lib/vue.esm-browser.js';
import Common from './common.js';

// Root component
let component = {
    data() {
        return {
            board: Common.data.board,
            size: Common.data.size,
        }
    },
    methods: {
        toRank: Common.methods.util.toRank,
        isPiece: Common.methods.util.isPiece,
        isDarkSquared: Common.methods.util.isDarkSquared,
        getPosition: Common.methods.board.getPosition,
        onDragStart: Common.methods.handler.onDragStart,
        onDragOver: Common.methods.handler.onDragOver,
        onDrop: Common.methods.handler.onDrop,
    }
};

// Setup vue
const app = createApp(component);
app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount('#app');
