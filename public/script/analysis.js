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
import { White, Black } from '../module/color.js';
import { Game } from '../module/analysis.js';
import * as Err from '../module/error.js';
import * as Face from './face.js';


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

export function locOf(y, x) {
    return Common.locOf(y, x, this.flip);
}

export function isEmpty(loc) {
    return Common.isEmpty(this.current.pos, loc);
}

export function getPiece(loc) {
    return Common.getPiece(this.current.pos, loc);
}

export function isClicked(loc) {
    const state = this.current;
    const result = state.result;
    if(result.ended) return false;

    const select = this.select;
    return select.click && loc === select.loc && loc in state.moves;
}

export function moveFrom(loc) {
    return loc === this.current.from;
}

export function moveTo(loc) {
    return loc === this.current.to;
}

export function canBeOccupied(loc) {
    const state = this.current;
    const result = state.result;
    if(result.ended) return false;

    const moves = state.moves;
    const src = this.select.loc;

    if(!(src in moves)) return false;
    return moves[src].includes(loc);
}

export function flipBoard() {
    this.flip = !this.flip;
}


/* Navigation */
export function isInitial() {
    return this.stateIdx === 0;
}

export function isLatest() {
    return this.stateIdx === this.state.length-1;
}

export function hasPrev() {
    return !this.isInitial;
}

export function hasNext() {
    return !this.isLatest;
}

export function toInitial(ev) {
    this.stateIdx = 0;
}

export function toPrev(ev) {
    this.stateIdx--;
}

export function toNext(ev) {
    this.stateIdx++;
}

export function toLatest(ev) {
    this.stateIdx = this.state.length-1;
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
    const ref = this.defaultSetup;
    const state = this.initial;

    return state.id === ref.id && state.clock.halfmove === ref.clock.halfmove &&
        state.clock.fullmove === ref.clock.fullmove;
}

export function initialState() {
    return this.state[0];
}

export function currentState() {
    return this.state[this.stateIdx];
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
    const pos = state.pos;
    const color = state.move;
    const promotion = isPromotion(pos, color, from, to);

    if(!promotion) game.move(from, to);
    else {
        this.promote = true;
        
        const ids = this.getPromotedIds();
        const promoted = await getPromoted(ids);
        
        this.promote = false;
        game.move(from, to, promoted);
    }

    this.state.push(game.getCurrentStateData());
    this.stateIdx++;

    console.log(this.current.notation, this.current.fen);
}


/* Selection */
export function onClick(ev) {
    if(this.promote) return;

    const state = this.current;
    const moves = state.moves;
    const current = this.select.loc;

    const loc = Common.getLoc(ev.target.id);
    const reset = {click: false, loc: Loc.None};
    
    if(!this.select.click) {
        if(loc in moves) this.select = {click: true, loc: loc};
        return;
    }

    if(current === loc) this.select = reset;
    else if(loc in moves) this.select.loc = loc;
    else if(moves[current].includes(loc)) {
        this.select = reset;
        this.movePiece(current, loc);
    }
}

export function onDragStart(ev) {
    if(this.promote) return;

    const src = Common.getLoc(ev.target.id);
    if(!this.select.click) this.select = {click: false, loc: src};
}

export function onDrop(ev) {
    if(this.promote || this.select.click) return;
    
    const src = this.select.loc;
    if(src === Loc.None) Face.disapprove();
    
    const state = this.current;
    const moves = state.moves;
    const loc =  Common.getLoc(ev.target.id);

    this.select.loc = Loc.None;
    if(!(src in moves)) return;
    if(moves[src].includes(loc)) this.movePiece(src, loc);
}


/* Lifecycle */
const paramImport = "import";
const formats = [paramFEN];

export function created() {
    const setup = game.getSetupData();
    this.defaultSetup = {clock: {...setup.clock}, id: setup.id};

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
    this.state.push(initial);

    this.select.loc = Loc.None;

    if(this.isDefaultSetup()) Common.deleteQueries(paramImport, paramFEN);
    else Common.setQuery(paramFEN, initial.fen);

    console.log(initial.notation, initial.fen);
}

function importGameState(format) {
    if(format === paramFEN) return FEN.load(Common.getQuery(paramFEN));
}
