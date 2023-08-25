import * as Common from './common.js';
import * as FEN from '../module/fen.js';
import * as Piece from '../module/piece.js';
import * as Filter from '../module/filter.js';
import * as Type from '../module/piece-type.js';
import * as AbstractPiece from '../module/abstract-piece.js';
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


/* Advantage */
const abstractPieces = Object.freeze(AbstractPiece.getList());
const pieceTypes = Object.freeze(abstractPieces.map(piece => piece.type));
const pieceValues = Object.freeze(abstractPieces.reduce((map, piece) => ({...map, [piece.type]: piece.value}), {}));

const pieces = Object.freeze(Piece.getList());
const whitePieces = Object.freeze(Filter.New(pieces, Piece.byColor(White))().reduce((map, piece) => ({...map, [piece.type]: piece.letter}), {}));
const blackPieces = Object.freeze(Filter.New(pieces, Piece.byColor(Black))().reduce((map, piece) => ({...map, [piece.type]: piece.letter}), {}));

const figurine = Object.freeze({
    [Type.TypePawn]: "♟︎",
    [Type.TypeKnight]: "♞",
    [Type.TypeBishop]: "♝",
    [Type.TypeRook]: "♜",
    [Type.TypeQueen]: "♛",
});
const multiplierDiff = Object.freeze({[White]: 1, [Black]: -1});


export function pieceDifference() {
    let diff = {};

    for(const type of pieceTypes) {
        const whiteCount = this.state.count[whitePieces[type]];
        const blackCount = this.state.count[blackPieces[type]];
        diff[type] = whiteCount-blackCount;
    }
    return diff;
}

export function topPieceAdv() {
    const color = this.flip? White : Black;
    return pieceAdvantage(this.pieceDifference, color);
}

export function topPointAdv() {
    const color = this.flip? White : Black;
    return Math.max(0, pointDifference(this.pieceDifference, color));
}

export function bottomPieceAdv() {
    const color = this.flip? Black : White;
    return pieceAdvantage(this.pieceDifference, color);
}

export function bottomPointAdv() {
    const color = this.flip? Black : White;
    return Math.max(0, pointDifference(this.pieceDifference, color));
}

export function formatPieceAdv(adv) {
    let str = "";
    
    for(const type in adv) str += figurine[type].repeat(adv[type]);
    return str;
}

export function formatPointAdv(points) {
    return `+${points}`;
}


function pieceAdvantage(diff, color) {
    let adv = {};

    for(const type in diff) {
        const cnt = diff[type] * multiplierDiff[color];
        if(cnt > 0) adv[type] = cnt;
    }
    return adv;
}

function pointDifference(diff, color) {
    let points = 0;

    for(const type in diff) {
        const cnt = diff[type] * multiplierDiff[color];
        points += cnt * pieceValues[type];
    }
    return points;
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
const formats = [paramFEN];

export function created() {
    game.useDefaultSetup();

    const ref = game.getSetupGameState();
    this.stateDefault = {
        clock: {...ref.clock},
        id: ref.id,
    };

    const format = Common.getQuery(paramImport);

    if(format && formats.includes(format)) {
        try {
            game.loadSetup(importGameState(format));
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

function importGameState(format) {
    if(format === paramFEN) return FEN.load(Common.getQuery(paramFEN));
}
