import { createApp } from '../lib/vue.esm-browser.js';
import * as Common from './common.js';

// Root component
const component = {
    data() {
        return {
            board: Common.vue.data.board,
            flipped: Common.vue.data.flipped,
            form: {
                castling: [],
            },
        }
    },
    methods: {
        toRank: Common.vue.methods.render.toRank,
        toFile: Common.vue.methods.render.toFile,
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
            this.board = Array(8).fill(Array(8).fill(Common.none));
        },
        resetBoard() {
            Common.game.resetPosition();
            this.board = Common.game.getPosition();
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
    },
};

// Setup vue
const app = createApp(component);
app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount('#app');
