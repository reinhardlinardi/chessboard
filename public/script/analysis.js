import * as Common from './common.js';
import * as FEN from '../module/fen.js';
import * as Type from '../module/piece-type.js';
import * as Loc from '../module/location.js';
import * as Pieces from '../module/pieces.js';
import * as AbstractPieces from '../module/abstract-pieces.js';
import * as Promotion from '../module/promotion.js';
import * as Score from '../module/game-score.js';
import * as Conclusion from '../module/game-conclusion.js';
import { isPromotion } from '../module/game-util.js';
import { Game } from '../module/analysis.js';
import { White, Black, getList as getColors } from '../module/color.js';
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
const pieceTypes = Object.freeze(AbstractPieces.getList().map(piece => piece.type));
const pieceValues = Object.freeze(AbstractPieces.getList().reduce((map, piece) => ({...map, [piece.type]: piece.value}), {}));

const whitePieces = Object.freeze(Pieces.getByColor(White)).reduce((map, piece) => ({...map, [piece.type]: piece.letter}), {});
const blackPieces = Object.freeze(Pieces.getByColor(Black)).reduce((map, piece) => ({...map, [piece.type]: piece.letter}), {});

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
    const state = this.current;

    for(const type of pieceTypes) {
        const whiteCount = state.pieces[whitePieces[type]];
        const blackCount = state.pieces[blackPieces[type]];
        diff[type] = whiteCount-blackCount;
    }
    return diff;
}

export function topPieceAdv() {
    const adv = c => pieceAdvantage(this.pieceDifference, c);
    return this.color === White? adv(Black): adv(White);
}

export function topPointAdv() {
    const points = c => Math.max(0, pointDifference(this.pieceDifference, c));
    return this.color === White? points(Black) : points(White);
}

export function bottomPieceAdv() {
    const adv = c => pieceAdvantage(this.pieceDifference, c);
    return this.color === White? adv(White) : adv(Black);
}

export function bottomPointAdv() {
    const points = c => Math.max(0, pointDifference(this.pieceDifference, c));
    return this.color === White? points(White) : points(Black);
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
const paramColor = "color";

export function rankOf(y) {
    return Common.rankOf(y, this.color);
}

export function fileOf(x) {
    return Common.fileOf(x, this.color);
}

export function labelOf(x) {
    return Common.labelOf(x, this.color);
}

export function locOf(y, x) {
    return Common.locOf(y, x, this.color);
}

export function isEmpty(loc) {
    return Common.isEmpty(this.current.pos, loc);
}

export function getPiece(loc) {
    return Common.getPiece(this.current.pos, loc);
}

export function isMoveLoc(loc) {
    return loc === this.current.from || loc === this.current.to;
}

export function isClicked(loc) {
    const state = this.current;
    const result = state.result;

    if(result.ended) return false;
    return loc === this.select && loc in state.moves;
}

export function canOccupy(loc) {
    const state = this.current;
    const result = state.result;

    if(result.ended) return false;

    const moves = state.moves;
    const src = this.select;

    if(!(src in moves)) return false;
    return moves[src].includes(loc);
}

export function canMoveTo(loc) {
    return this.canOccupy(loc) && this.isEmpty(loc);
}

export function canCaptureOn(loc) {
    return this.canOccupy(loc) && !this.isEmpty(loc);
}

export function flipBoard() {
    this.color = this.color === White? Black : White;
    Common.setQuery(paramColor, this.color);
}


/* Table */
const numRows = 8;

export function getTableRows() {
    this.updateTableView();

    let rows = [];
    const table = this.table;

    for(let idx = table.start; idx < table.end; idx += 2) {
        const fullmove = idx < this.len? this.state.data[idx].clock.fullmove : "";
        const white = idx < this.len? this.state.data[idx].notation : "";
        const black = idx+1 < this.len? this.state.data[idx+1].notation : "";

        rows.push({
            num: fullmove,
            white: {move: white, idx: idx},
            black: {move: black, idx: idx+1},
        });
    }

    return rows;
}

export function updateTableView() {
    const idx = this.state.idx;
    const move = this.state.data[idx].move;

    const table = this.table;
    const start = table.start;
    const end = table.end;

    if(idx < start) {
        table.start = Math.max(table.min, move === White? idx-1 : idx);
        table.end = table.start + 2*numRows;
    }
    if(idx >= end) {
        table.end = move === White? idx+1 : idx+2;
        table.start = table.end - 2*numRows;
    }
}


/* Navigation */
export function isValidIdx(idx) {
    return idx < this.len;
}

export function isInitial() {
    return this.state.idx === 0;
}

export function isLatest() {
    return this.state.idx === this.len-1;
}

export function hasPrev() {
    return !this.isInitial();
}

export function hasNext() {
    return !this.isLatest();
}

export function toInitial(ev) {
    this.state.idx = 0;
    this.select = Loc.None;
}

export function toPrev(ev) {
    if(!this.hasPrev()) return;

    this.state.idx--;
    this.select = Loc.None;
}

export function toNext(ev) {
    if(!this.hasNext()) return;
    
    this.state.idx++;
    this.select = Loc.None;
}

export function toLatest(ev) {
    this.state.idx = this.len-1;
    this.select = Loc.None;
}

export function toMove(ev) {
    const data = Common.getElementData(ev.target.id);
    const idx = parseInt(data.stateIdx);
    
    this.state.idx = idx;
    this.select = Loc.None;
}


/* Result */
const conclusionText = Object.freeze({
    [Conclusion.WhiteCheckmate]: "White wins",
    [Conclusion.BlackCheckmate]: "Black wins",
    [Conclusion.Stalemate]: "Stalemate",
    [Conclusion.Insufficient]: "Insufficient material",
    [Conclusion.Repetition]: "Threefold repetition",
    [Conclusion.FiftyMove]: "Draw",
});

export function getScore() {
    const result = this.current.result;
    if(!result.ended) return "-";

    const score = result.score;
    if(Score.wonBy(White, score)) return "1 - 0";
    if(Score.wonBy(Black, score)) return "0 - 1";

    return "½ - ½";
}

export function getConclusion() {
    const result = this.current.result;
    if(!result.ended) return "-";

    const conclusion = result.conclusion;
    return conclusionText[conclusion];
}


/* Promotion */
const whitePromoted = Promotion.getTypes().map(type => Pieces.getBy(White, type).letter);
const blackPromoted = Promotion.getTypes().map(type => Pieces.getBy(Black, type).letter);

export function getPromotedPieces() {
    const state = this.current;
    return state.move === White? whitePromoted : blackPromoted;
}

export function getPromotedIds() {
    return this.getPromotedPieces().map(letter => `promoted-${letter}`);
}

async function getPromoted(ids) {
    return new Promise(resolve => {
        for(const id of ids) Common.getElement(id).onclick = (ev) => {
            const piece = Common.getPieceType(ev.target.id);
            resolve(Pieces.get(piece).type);
        };
    });
}


/* State */
export function isDefaultSetup() {
    const ref = this.ref;
    const initial = this.state.data[0];

    return initial.id === ref.id && initial.clock.halfmove === ref.clock.halfmove &&
        initial.clock.fullmove === ref.clock.fullmove;
}

export function len() {
    return this.state.data.length;
}

export function current() {
    return this.state.data[this.state.idx];
}


/* FEN */
const paramFEN = "fen";

export function copyFEN(ev) {
    const fen = Common.getElement("fen").value;
    navigator.clipboard.writeText(fen);
    
    console.log("FEN copied");
}


/* Move */
export async function movePiece(from, to) {
    const state = this.current;
    const idx = this.state.idx;

    const promotion = isPromotion(state.pos, state.move, from, to);
    let promoted = Type.TypeNone;

    if(promotion) {
        this.promote = true;
        promoted = await getPromoted(this.getPromotedIds());
        this.promote = false;
    }

    const skip = this.skipMove(from, to, promotion, promoted);
    if(!skip) {
        if(idx < this.len-1) {
            game.undo(state.clock.fullmove, state.move);
            this.state.data = this.state.data.slice(0, idx+1);
        }
        
        if(promotion) game.move(from, to, promoted);
        else game.move(from, to);

        const latest = game.getCurrentStateData();
        this.state.data.push(latest);
    }

    this.state.idx++;
}

export function skipMove(from, to, promotion, promoted = Type.TypeNone) {
    const idx = this.state.idx;
    if(idx === this.len-1) return false;

    const next = this.state.data[idx+1];
    return from === next.from && to === next.to && (promotion? promoted === next.promoted : true);
}


/* Selection */
export function onClick(ev) {
    if(this.promote) return;

    const state = this.current;
    const moves = state.moves;

    const current = this.select;
    const loc = Common.getLoc(ev.target.id);
    
    if(this.select === Loc.None) {
        if(loc in moves) this.select = loc;
        return;
    }

    if(current === loc) this.select = Loc.None;
    else if(loc in moves) this.select = loc;
    else if(moves[current].includes(loc)) {
        this.select = Loc.None;
        this.movePiece(current, loc);
    }
}

export function onDragStart(ev) {
    if(this.promote) return;

    const src = Common.getLoc(ev.target.id);
    this.select = src;
}

export function onDrop(ev) {
    if(this.promote) return;
    
    const src = this.select;
    if(src === Loc.None) return;
    
    const state = this.current;
    const moves = state.moves;
    
    const loc =  Common.getLoc(ev.target.id);
    this.select = Loc.None;

    if(!(src in moves)) return;
    if(moves[src].includes(loc)) this.movePiece(src, loc);
}


/* Keyboard */
export function onKeyDown(ev) {
    switch(ev.code) {
        case "ArrowUp": this.toInitial(); break;
        case "ArrowLeft": this.toPrev(); break;
        case "ArrowRight": this.toNext(); break;
        case "ArrowDown": this.toLatest(); break;
    }
}


/* Lifecycle */
const paramImport = "import";
const formats = [paramFEN];

export function created() {
    const setup = game.getSetupData();
    this.ref = {clock: {...setup.clock}, id: setup.id};

    const format = Common.getQuery(paramImport);

    if(format && formats.includes(format)) {
        try {
            game.loadSetup(importGameState(format));
            game.validateSetup();
        }
        catch(err) {
            console.log(Err.str(err));
            game.resetSetup();
        }
    }

    game.start();

    const initial = game.getInitialStateData();
    const tableIdx = initial.move === White? 1 : 0;

    this.state.data.push(initial);
    this.select = Loc.None;
    this.table = {start: tableIdx, end: tableIdx + 2*numRows, min: tableIdx};

    /* Keyboard handlers */
    document.onkeydown = this.onKeyDown;

    /* Query URL */
    const color = Common.getQuery(paramColor);
    this.color = color && getColors().includes(color)? color : White;
    Common.setQuery(paramColor, this.color);

    if(this.isDefaultSetup()) Common.deleteQueries(paramImport, paramFEN);
    else Common.setQuery(paramFEN, initial.fen);
}

function importGameState(format) {
    if(format === paramFEN) return FEN.load(Common.getQuery(paramFEN));
}
