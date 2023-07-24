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
        toRank: Common.methods.toRank,
        isPiece: Common.methods.isPiece,
        isDarkSquared: Common.methods.isDarkSquared,
        getPosition: Common.methods.getPosition,
    }
};

// Setup vue
const app = createApp(component);
app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount('#app');
