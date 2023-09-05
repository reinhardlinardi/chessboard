import * as Common from './common.js';
import * as FEN from '../module/fen.js';
import * as Type from '../module/piece-type.js';
import * as Loc from '../module/location.js';
import * as Piece from '../module/piece.js';
import * as Pieces from '../module/pieces.js';
import * as AbstractPieces from '../module/abstract-pieces.js';
import * as Promotion from '../module/promotion.js';
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

    for(const type of pieceTypes) {
        const whiteCount = this.state.pieces[whitePieces[type]];
        const blackCount = this.state.pieces[blackPieces[type]];
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
    return Common.isEmpty(this.state.pos, Loc.of(file, rank));
}

export function getPiece(rank, file) {
    return Common.getPiece(this.state.pos, Loc.of(file, rank));
}

export function isClicked(rank, file) {
    const select = this.select;
    const loc = Loc.of(file, rank);
    return select.click && loc === select.loc && loc in this.state.moves;
}

export function canBeOccupied(rank, file) {
    if(this.state.ended) return false;

    const moves = this.state.moves;
    const src = this.select.loc;
    const loc = Loc.of(file, rank);

    if(!(src in moves)) return false;
    return moves[src].includes(loc);
}

export function flipBoard() {
    this.flip = !this.flip;
}


/* Promotion */
const whitePromoted = Promotion.getTypes().map(type => Pieces.getBy(White, type).letter);
const blackPromoted = Promotion.getTypes().map(type => Pieces.getBy(Black, type).letter);

export function getPromotedPieces() {
    return this.state.move === White? whitePromoted : blackPromoted;
}

export function getPromotedIds() {
    return this.getPromotedPieces().map(letter => `promoted-${letter}`);
}

export function isPromotionMove(from, to) {
    const color = this.state.move;
    
    const pawn = Pieces.getBy(color, Type.TypePawn).letter;
    const promoteRank = Promotion.promoteRank(color);

    const piece = Common.getPiece(this.state.pos, from);
    const rank = Loc.rank(to);
    
    return piece === pawn && rank === promoteRank;
}

async function getPromoted(ids) {
    return new Promise(resolve => {
        for(const id of ids) Common.getElement(id).onclick = (ev) => {
            resolve(Common.getPieceType(ev.target.id));
        };
    });
}


/* State */
export function isDefaultState() {
    const ref = this.stateDefault;
    const state = this.state;

    return state.id === ref.id && state.clock.halfmove === ref.clock.halfmove &&
        state.clock.fullmove === ref.clock.fullmove;
}


/* FEN */
const paramFEN = "fen";

export function copyFEN(ev) {
    const fen = Common.getElement("fen").value;
    navigator.clipboard.writeText(fen);
    
    console.log("FEN copied");
}


/* Move */
export async function move(from, to) {
    if(this.isPromotionMove(from, to)) {
        this.promote = true;
        const ids = this.getPromotedIds();

        const promoted = await getPromoted(ids);
        this.promote = false;

        console.log("move from", from, "to", to, "then promote to", promoted);
        //game.move(from, to, promoted);
    } else {
        console.log("move from", from, "to", to);
        //game.move(from, to);
    }
}


/* Selection */
export function onClick(ev) {
    if(this.promote) return;

    const moves = this.state.moves;
    const current = this.select.loc;

    const loc = Common.getLoc(ev.target.id);
    const reset = {click: false, loc: Loc.None};
    
    if(current === Loc.None) this.select = {click: true, loc: loc};
    else if(current === loc || !(current in moves)) this.select = reset;
    else if(!moves[current].includes(loc)) this.select.loc = loc;
    else {
        this.select = reset;
        this.move(current, loc);
    }
}

export function onDragStart(ev) {
    if(this.promote) return;

    const src = Common.getLoc(ev.target.id);
    this.select = {click: false, loc: src};
}

export function onDrop(ev) {
    if(this.promote) return;

    const src = this.select.loc;
    if(this.select.click || src === Loc.None) Face.disapprove();
    
    const moves = this.state.moves;
    const loc =  Common.getLoc(ev.target.id);

    this.select.loc = Loc.None;
    if(!(src in moves)) return;
    if(moves[src].includes(loc)) this.move(src, loc);
}


/* Lifecycle */
const paramImport = "import";
const formats = [paramFEN];

export function created() {
    const setup = game.getSetupData();
    this.stateDefault = {
        clock: {...setup.clock},
        id: setup.id,
    };

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

    this.state = game.getInitialStateData();
    this.select.loc = Loc.None;

    if(this.isDefaultState()) Common.deleteQueries(paramImport, paramFEN);
}

function importGameState(format) {
    if(format === paramFEN) return FEN.load(Common.getQuery(paramFEN));
}
