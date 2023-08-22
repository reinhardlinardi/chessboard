import * as Piece from '../module/piece.js';
import * as File from '../module/file.js';
import * as Position from '../module/position.js';
import { Size as size } from '../module/size.js';


/* URL */
const q = new URLSearchParams(window.location.search);

export function hasQueryParam(name) {
    return q.has(name);
}

export function getQueryParam(name) {
    return q.get(name);
}

export function setQueryParam(name, value) {
    q.set(name, value);
    replaceHistory();
}

export function deleteQueryParam(name) {
    q.delete(name);
    replaceHistory();
}

export function replaceHistory() {
    const url = `${window.location.pathname}${queryURL()}`;
    window.history.replaceState({}, "", url);
}

export function replaceURL(path) {
    window.location.href = `${path}${queryURL()}`;
}

function queryURL() {
    return q.size === 0? "" : `?${q.toString()}`;
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
export function getPiece(board, rank, file) {
    return Position.get(board, rank, file);
}

export function setPiece(piece, board, rank, file) {
    Position.set(piece, board, rank, file);
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

export function isEmpty(board, rank, file) {
    return getPiece(board, rank, file) === _;
}


/* Drag and drop */
const mime = "text/plain";

export function dragSetId(ev, id) {
    let dnd = ev.dataTransfer;

    // Save dragged piece id
    dnd.setData(mime, id);
    // Allow copy or move piece
    dnd.effectAllowed = "copyMove";
}

export function dropGetId(ev) {
    const dnd = ev.dataTransfer;

    // Get dragged piece id
    const id = dnd.getData(mime);

    // Throw exception if text is dropped
    if(getElement(id) === null) throw "ಠ_ಠ";
    else return id;
}

export function replacePiece(id, piece, board) {
    const data = getElementData(id);
    setPiece(piece, board, data.rank, data.file);
}

export function removePiece(id, board) {
    const data = getElementData(id);
    setPiece(_, board, data.rank, data.file);
}
