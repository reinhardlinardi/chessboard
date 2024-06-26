import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import * as page from './analysis.js';

// Root component
const component = {
    data() {
        return {
            state: {
                data: [],
                idx: 0,
            },
            color: "",
            promote: false,
            select: 0,
            table: {
                start: 0,
                end: 0,
                min: 0,
            },
            ref: {},
        }
    },
    computed: {
        len: page.len,
        current: page.current,
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
        isMoveLoc: page.isMoveLoc,
        isSelected: page.isSelected,
        canOccupy: page.canOccupy,
        canMoveTo: page.canMoveTo,
        canCaptureOn: page.canCaptureOn,

        flipBoard: page.flipBoard,

        getTableRows: page.getTableRows,
        updateTableView: page.updateTableView,

        isValidIdx: page.isValidIdx,
        isInitial: page.isInitial,
        isLatest: page.isLatest,
        hasPrev: page.hasPrev,
        hasNext: page.hasNext,
        toInitial: page.toInitial,
        toPrev: page.toPrev,
        toNext: page.toNext,
        toLatest: page.toLatest,
        toMove: page.toMove,

        getScore: page.getScore,
        getConclusion: page.getConclusion,

        getPromotedPieces: page.getPromotedPieces,
        getPromotedIds: page.getPromotedIds,

        isDefaultSetup: page.isDefaultSetup,

        copyFEN: page.copyFEN,

        movePiece: page.movePiece,
        skipMove: page.skipMove,

        onClick: page.onClick,
        onDragStart: page.onDragStart,
        onDrop: page.onDrop,
        
        onKeyDown: page.onKeyDown,
    },
    created: page.created,
};

// Setup vue
const app = createApp(component);
app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount('#app');
