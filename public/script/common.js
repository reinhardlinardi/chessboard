import * as Piece from '../module/piece.js';
import * as File from '../module/file.js';
import * as Position from '../module/position.js';
import * as FEN from '../module/fen.js';
import * as ID from '../module/id.js';


/* History API */
const q = new URLSearchParams(window.location.search);

export function replaceHistory() {
    const url = (q.size === 0)? "/" : `?${q.toString()}`; 
    window.history.replaceState({}, "", url);
}


/* Query Param */
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


/* FEN */
export function generateFEN(state) {
    return FEN.Generate(state);
}


/* State */
export function getStateId(fen) {
    return ID.getStateId(fen);
}


/* Rendering */
const _ = Piece.None;

export function rankOf(y, flip) {
    return flip? y+1: 8-y;
}

export function fileOf(x, flip) {
    return flip? 8-x: x+1;
}

export function labelOf(x, flip) {
    return File.labelOf(fileOf(x, flip));
}

export function isEmpty(board, rank, file) {
    return getPiece(board, rank, file) === _;
}


/* Drag and drop */
const mime = "text/plain";

export function fromTray(id) {
    return id.includes("tray");
}

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
    // Id is "\r\n" when we drag from empty square, so trim is used to transform invalid id to ""
    return dnd.getData(mime).trim();
}

export function getDraggedPiece(id, board) {
    const data = getElementData(id);
    return fromTray(id)? data.pieceType: getPiece(board, data.rank, data.file);
}

export function replacePiece(id, piece, board) {
    const data = getElementData(id);
    setPiece(piece, board, data.rank, data.file);
}

export function removePiece(id, board) {
    const data = getElementData(id);
    setPiece(_, board, data.rank, data.file);
}
