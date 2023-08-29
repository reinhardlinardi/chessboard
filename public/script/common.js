import * as Piece from '../module/piece.js';
import * as File from '../module/file.js';
import * as Position from '../module/position.js';
import * as Loc from '../module/location.js';
import { Size as size } from '../module/size.js';


/* URL */
const q = new URLSearchParams(window.location.search);

export function getQuery(name) {
    return q.get(name);
}

export function setQuery(name, value) {
    q.set(name, value);
    replaceHistory();
}

export function deleteQuery(name) {
    q.delete(name);
    replaceHistory();
}

export function deleteQueries(...names) {
    for(const name of names) q.delete(name);
    replaceHistory();
}

export function replaceHistory() {
    const url = `${window.location.pathname}${queryURL(q)}`;
    window.history.replaceState({}, "", url);
}

export function openURL(path, params) {
    const query = new URLSearchParams();
    for(const key in params) query.set(key, params[key]);
    
    window.location.href = `${path}${queryURL(query)}`;
}

function queryURL(query) {
    return query.size === 0? "" : `?${query.toString()}`;
}


/* DOM */
export function getElement(id) {
    return document.getElementById(id);
}

export function getElementData(id) {
    // Return data from data-* attribute
    return getElement(id).dataset;
}


/* Board */
export function getPiece(board, loc) {
    return Position.getByLoc(board, loc);
}

export function setPiece(piece, board, loc) {
    Position.setByLoc(piece, board, loc);
}


/* Data */
export function getLoc(id) {
    const data = getDataElseAnnoyed(id);
    return Loc.of(parseInt(data.file), parseInt(data.rank));
}

export function getPieceType(id) {
    const data = getDataElseAnnoyed(id);
    return data.pieceType;
}


/* Rendering */
const _ = Piece.None;

export function rankOf(y, flip) {
    return flip? y+1 : size-y;
}

export function fileOf(x, flip) {
    return flip? size-x : x+1;
}

export function labelOf(x, flip) {
    return File.labelOf(fileOf(x, flip));
}

export function isEmpty(board, loc) {
    return _ === getPiece(board, loc);
}


/* Drag and drop */
const mime = "text/plain";

export function dragSetId(ev, id) {
    let dnd = ev.dataTransfer;
    dnd.setData(mime, id);
}

export function dropGetId(ev) {
    const dnd = ev.dataTransfer;
    return dnd.getData(mime);
}

export function replacePiece(loc, piece, board) {
    setPiece(piece, board, loc);
}

export function replacePieceById(id, piece, board) {
    replacePiece(getLoc(id), piece, board);
}

export function removePiece(loc, board) {
    setPiece(_, board, loc);
}

export function removePieceById(id, board) {
    removePiece(getLoc(id), board);
}


/* Bonus */
export function annoyed() {
    throw "ಠ_ಠ";
}

function getDataElseAnnoyed(id) {
    try {
        return getElementData(id);
    }
    catch(err) {
        annoyed();
    }
}
