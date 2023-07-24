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
        getPosition: Common.methods.getPosition,
        getRank: Common.methods.getRank,
        getFileLetter: Common.methods.getFileLetter,
        isDarkSquared: Common.methods.isDarkSquared,
    }
};

// Setup vue
const app = createApp(component);
app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount('#app');
