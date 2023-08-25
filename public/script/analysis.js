import * as Common from './common.js';
import * as FEN from '../module/fen.js';
import * as Piece from '../module/piece.js';
import * as Filter from '../module/filter.js';
import * as AbstractPiece from '../module/abstract-piece.js';
import * as Type from '../module/piece-type.js';
import { White, Black } from '../module/color.js';
import { Game } from '../module/analysis.js';
import * as Err from '../module/error.js';


const game = new Game();


/* Color */
export function white() {
    return White;
}

export function black() {
    return Black;
}


/* Material advantage */
const abstractPieces = AbstractPiece.getList();
const pieces = Piece.getList();

const types = abstractPieces.map(piece => piece.type);
const values = abstractPieces.reduce((map, piece) => ({...map, [piece.type]: piece.value}), {});
const whitePieces = Filter.New(pieces, Piece.byColor(White))().reduce((map, piece) => ({...map, [piece.type]: piece.letter}), {});
const blackPieces = Filter.New(pieces, Piece.byColor(Black))().reduce((map, piece) => ({...map, [piece.type]: piece.letter}), {});

const figurine = {
    [Type.TypePawn]: "♟︎",
    [Type.TypeKnight]: "♞",
    [Type.TypeBishop]: "♝",
    [Type.TypeRook]: "♜",
    [Type.TypeQueen]: "♛",
}



export function pieceAdvantage(color) {
    let cnt = countDifference(this.state.count);
    if(color === Black) {
        for(const type in cnt) cnt[type] *= -1;
    }

}

export function materialAdvantage(color) {
    let str = "";
    let total = 0;
    
    let cnt = countDifference(this.state.count)
    if(color === Black) {
        for(const type in cnt) cnt[type] *= -1;
    }

    for(const type in cnt) {
        const diff = cnt[type];
        if(diff === 0) continue;
        if(diff > 0) str += figurine[type].repeat(diff);

        total += diff * values[type];
    }

    if(total > 0) str += ` +${total}`;
    return str;
}

function countDifference(count) {
    let cnt = {};
    
    for(let idx = 0; idx < types.length; idx++) {
        const type = types[idx];
        if(type !== Type.TypeKing) {
            const whiteCount = count[whitePieces[type]];
            const blackCount = count[blackPieces[type]];
            cnt[type] = whiteCount-blackCount;
        }
    }
    return cnt;
}


/* Board */
export function rankOf(y) {
    return Common.rankOf(y, this.flip);
}

export function fileOf(x) {
    return Common.fileOf(x, this.flip);
}

export function labelOf(x) {
    return Common.labelOf(x, this.flip);
}

export function isEmpty(rank, file) {
    return Common.isEmpty(this.state.pos, rank, file);
}

export function getPiece(rank, file) {
    return Common.getPiece(this.state.pos, rank, file);
}

export function flipBoard() {
    this.flip = !this.flip;
}


/* State */
export function isDefaultState() {
    const ref = this.stateDefault;
    const state = this.state;

    return state.id === ref.id && state.clock.halfmove === ref.clock.halfmove &&
        state.clock.fullmove === ref.clock.fullmove;
}

export function updateState(state) {
    this.state = state;
}


/* FEN */
const paramFEN = "fen";

export function copyFEN(ev) {
    const fen = Common.getElement("fen").value;
    navigator.clipboard.writeText(fen);
    
    console.log("FEN copied");
}


/* Drag and drop */
export function onDragStart(ev) {
    Common.dragSetId(ev, ev.target.id);
}

export function getDraggedPiece(id) {
    const data = Common.getElementData(id);
    return Common.getPiece(this.state.pos, data.rank, data.file);
}

export function onDropReplace(ev) {
    const srcId = Common.dropGetId(ev);
    const destId = ev.target.id;

    // Return if dnd to self
    if(srcId === destId) return;
    
    // Replace piece in dest
    const piece = this.getDraggedPiece(srcId, this.state.pos);

    let state = {...this.state};
    Common.replacePiece(destId, piece, state.pos);
    Common.removePiece(srcId, state.pos);
    this.updateState(state);
}


/* Lifecycle */
const paramImport = "import";

export function created() {
    game.useDefaultSetup();

    const ref = game.getSetupGameState();
    this.stateDefault = {
        clock: {...ref.clock},
        id: ref.id,
    };

    const from = Common.getQuery(paramImport);
    if(from && from === paramFEN) {
        try {
            game.loadSetup(importGameState(from));
            game.validateSetup();
        }
        catch(err) {
            console.log(Err.str(err));
            game.useDefaultSetup();
        }
    }

    game.start();
    this.updateState(game.getSetupGameState());

    if(this.isDefaultState()) Common.deleteQueries(paramImport, paramFEN);
}

function importGameState(from) {
    if(from === paramFEN) return FEN.load(Common.getQuery(paramFEN));
}
