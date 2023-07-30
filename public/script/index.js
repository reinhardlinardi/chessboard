import { createApp } from '../lib/vue.esm-browser.js';

import * as Common from './common.js';
import * as Color from '../module/color.js';
import * as Piece from '../module/piece.js';
import * as Setup from '../module/setup.js';

// Root component
const component = {
    data() {
        return {
            board: Common.vue.data.board,
            flipped: Common.vue.data.flipped,
            form: {
                whiteToMove: true,
                castling: [],
            },
            topTray: Piece.getTypes(Color.Black).map(piece => piece.letter),
            bottomTray: Piece.getTypes(Color.White).map(piece => piece.letter),
        }
    },
    methods: {
        range: Common.vue.methods.util.range,
        rankOf: Common.vue.methods.render.rankOf,
        fileOf: Common.vue.methods.render.fileOf,
        labelOf: Common.vue.methods.render.labelOf,
        isEmpty: Common.vue.methods.render.isEmpty,
        getPiece: Common.vue.methods.board.getPiece,
        setPiece: Common.vue.methods.board.setPiece,
        flipBoard: Common.vue.methods.board.flipBoard,
        getElement: Common.vue.methods.dom.getElement,
        getElementData: Common.vue.methods.dom.getElementData,
        fromTray: Common.vue.methods.dnd.fromTray,
        dragSetId: Common.vue.methods.dnd.dragSetId,
        dropGetId: Common.vue.methods.dnd.dropGetId,
        getDraggedPiece: Common.vue.methods.dnd.getDraggedPiece,
        replacePiece: Common.vue.methods.dnd.replacePiece,
        removePiece: Common.vue.methods.dnd.removePiece,
        clearBoard() {
            this.board = Array(8).fill(Array(8).fill(Piece.None));
        },
        resetBoard() {
            this.board = Setup.getDefaultSetup();
            this.flipped = false;
        },
        onDragStart(ev) {
            this.dragSetId(ev, ev.target.id);
        },
        onDropReplaceOrCopy(ev) {
            const srcId = this.dropGetId(ev);
            const destId = ev.target.id;

            // Return if src not valid or dnd to self
            if(srcId === "" || srcId === destId) return;
            
            // Replace piece in dest
            const piece = this.getDraggedPiece(srcId);
            this.replacePiece(destId, piece);

            // Remove piece in src if not tray
            if(!this.fromTray(srcId)) this.removePiece(srcId);
        },
        onDropRemove(ev) {
            // Get dragged piece id
            const srcId = this.dropGetId(ev);

            // Remove piece if src is not tray
            if(!this.fromTray(srcId))  this.removePiece(srcId);
        },
        getTopTrayPiece(idx) {
            return this.flipped? this.bottomTray[idx]: this.topTray[idx];  
        },
        getBottomTrayPiece(idx) {
            return this.flipped? this.topTray[idx]: this.bottomTray[idx];
        },
        // getCastlingOptions() {
        //     return 
        // }
        // isCastlingPossible(val) {
        //     switch(val) {
        //         case "K":
        //             return this.getPiece(0, 4) == "K" && this.getPiece(0, 7) == "R"
        //     }
        //     return false;
        // }
    },
};

// Setup vue
const app = createApp(component);
app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount('#app');
