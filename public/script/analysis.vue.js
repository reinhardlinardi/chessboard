import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import * as page from './analysis.js';

// Root component
const component = {
    data() {
        return {
            state: {},
            flip: false,
        }
    },
    // computed: {
    //     fen: page.getFEN,
    // },
    methods: {
        // getTrayPiece: page.getTrayPiece,
        
        rankOf: page.rankOf,
        fileOf: page.fileOf,
        labelOf: page.labelOf,
        isEmpty: page.isEmpty,
        getPiece: page.getPiece,

        flipBoard: page.flipBoard,

        updateState: page.updateState,

        // copyFEN: page.copyFEN,

        // onDragStart: page.onDragStart,
        // onDropReplaceOrCopy: page.onDropReplaceOrCopy,
        // onDropRemove: page.onDropRemove,
    },
    created: page.created,
};

// Setup vue
const app = createApp(component);
app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount('#app');
