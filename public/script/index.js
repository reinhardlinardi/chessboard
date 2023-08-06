import * as Setup from '../module/setup.js';
import * as Color from '../module/color.js';
import * as Clock from '../module/clock.js';
import * as Piece from '../module/piece.js';
import * as Castle from '../module/castle.js';
import * as File from '../module/file.js';
import * as FEN from '../module/fen.js';
import * as Hex from '../module/hex.js';
import * as Editor from '../module/editor.js';


const w = Color.White;
const b = Color.Black;

const fenParamName = "fen";


export const topTray = Piece.getByColor(b).map(piece => piece.letter);
export const bottomTray = Piece.getByColor(w).map(piece => piece.letter);


export const render = {
    getTrayPieceIdx() {
        return [...Array(6).keys()];
    },
    getTopTrayPiece(idx) {
        return this.flipped? bottomTray[idx]: topTray[idx];  
    },
    getBottomTrayPiece(idx) {
        return this.flipped? topTray[idx]: bottomTray[idx];
    },
    getWhiteCastleTypes() {
        return Castle.getByColor(w);
    },
    getBlackCastleTypes() {
        return Castle.getByColor(b);
    },
};

export const option = {
    whiteColor() {
        return w;
    },
    blackColor() {
        return b;
    },
    setCastle(ev) {
        const data = this.getElementData(ev.target.id);
        const type = data.castleType;
        const value = ev.target.checked;

        this.form.castle[type] = value;
    },
    disableCastle(type) {
        const enabled = Editor.hasCastlePosition(type, this.board);
        if(!enabled) this.form.castle[type] = false;

        return !enabled;
    },
    getEnPassantTargets() {
        const targets = Editor.getEnPassantTargets(this.form.move, this.board);
        const squares = targets.map(square => `${File.labelOf(square.file)}${square.rank}`);

        const idx = squares.findIndex(val => val === this.form.enPassant);
        if(idx === -1) this.form.enPassant = "";

        return squares;
    },
};

export const fen = {
    generateFEN() {
        const form = this.form;
        const castle = Object.keys(form.castle).filter(type => form.castle[type]);
        
        const fen = FEN.Generate(this.board, form.move, castle, form.enPassant, this.clock);
        const hex = Hex.from(fen);
        this.hex = hex;
        
        if(this.isInitial()) this.deleteQueryParam(fenParamName);
        else this.setQueryParam(fenParamName, fen);

        return fen;
    },
    loadFEN(ev) {
        console.log("Load FEN", ev.target.value);
    },
};

export const state = {
    isInitial() {
        const initial = this.initial;

        return this.hex === initial.hex && this.clock.halfmove === initial.clock.halfmove &&
            this.clock.fullmove === initial.clock.fullmove;
    },
};

export const board = {
    resetBoard() {
        this.board = Setup.defaultSetup();
        this.flipped = false;
    },
    clearBoard() {
        this.board = Setup.emptySetup();
    },
};

/* Drag and drop */
export const dnd = {
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
        this.replacePiece(piece, destId);

        // Remove piece in src if not tray
        if(!this.fromTray(srcId)) this.removePiece(srcId);
    },
    onDropRemove(ev) {
        // Get dragged piece id
        const srcId = this.dropGetId(ev);

        // Remove piece if src is not tray
        if(!this.fromTray(srcId))  this.removePiece(srcId);
    },
};

export const lifecycle = {
    created() {
        const form = this.form;

        this.board = Setup.defaultSetup();
        form.move = w;
        
        this.clock = Clock.New();
        this.initial.clock = Clock.New();

        form.castle = [...Castle.getByColor(w), ...Castle.getByColor(b)]
            .map(castle => castle.letter)
            .reduce((opt, type) => ({...opt, [type]: false}), {});

        const castle = Object.keys(form.castle).filter(type => form.castle[type]);
        const hex = Hex.from(FEN.Generate(this.board, form.move, castle, form.enPassant, this.clock));
        
        this.hex = hex;
        this.initial.hex = hex;
    },
    mounted() {
        // Load FEN if has query param
    },
};
