import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import * as page from './analysis.js';

// Root component
const component = {
    data() {
        return {
            state: {},
            flip: false,
            stateDefault: {
                clock: {},
                id: "",
            },
        }
    },
    methods: {
        white: page.white,
        black: page.black,
        
        pieceAdvantage: page.pieceAdvantage,
        pointAdvantage: page.pointAdvantage,

        rankOf: page.rankOf,
        fileOf: page.fileOf,
        labelOf: page.labelOf,
        isEmpty: page.isEmpty,
        getPiece: page.getPiece,

        flipBoard: page.flipBoard,

        isDefaultState: page.isDefaultState,
        updateState: page.updateState,

        copyFEN: page.copyFEN,

        getDraggedPiece: page.getDraggedPiece,
        onDragStart: page.onDragStart,
        onDropReplace: page.onDropReplace,
    },
    created: page.created,
};

// Setup vue
const app = createApp(component);
app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount('#app');
