import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import * as page from './analysis.js';

// Root component
const component = {
    data() {
        return {
            state: {},
            flip: false,
            selected: 0,
            stateDefault: {
                clock: {},
                id: "",
            },
        }
    },
    computed: {
        pieceDifference: page.pieceDifference,
    },
    methods: {
        white: page.white,
        black: page.black,
        
        topPieceAdv: page.topPieceAdv,
        topPointAdv: page.topPointAdv,
        bottomPieceAdv: page.bottomPieceAdv,
        bottomPointAdv: page.bottomPointAdv,
        formatPieceAdv: page.formatPieceAdv,
        formatPointAdv: page.formatPointAdv,

        rankOf: page.rankOf,
        fileOf: page.fileOf,
        labelOf: page.labelOf,
        isEmpty: page.isEmpty,
        getPiece: page.getPiece,

        canBeOccupied: page.canBeOccupied,

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
