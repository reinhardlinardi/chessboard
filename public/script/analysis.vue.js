import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import * as page from './analysis.js';

// Root component
const component = {
    data() {
        return {
            state: {},
            move: {},
            flip: false,
            promote: false,
            select: {
                click: false,
                loc: 0,
            },
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
        locOf: page.locOf,
        isEmpty: page.isEmpty,
        getPiece: page.getPiece,
        isClicked: page.isClicked,
        moveFrom: page.moveFrom,
        moveTo: page.moveTo,
        canBeOccupied: page.canBeOccupied,

        flipBoard: page.flipBoard,

        getPromotedPieces: page.getPromotedPieces,
        getPromotedIds: page.getPromotedIds,

        isDefaultState: page.isDefaultState,

        copyFEN: page.copyFEN,

        movePiece: page.movePiece,

        onClick: page.onClick,
        onDragStart: page.onDragStart,
        onDrop: page.onDrop,
    },
    created: page.created,
};

// Setup vue
const app = createApp(component);
app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount('#app');
