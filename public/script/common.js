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
export function getPiece(board, rank, file) {
    return Position.get(board, rank, file);
}

export function getPieceByLoc(board, loc) {
    return Position.getByLoc(board, loc);
}

export function setPiece(piece, board, rank, file) {
    Position.set(piece, board, rank, file);
}

export function setPieceByLoc(piece, board, loc) {
    Position.setByLoc(piece, board, loc);
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
}

export function dropGetId(ev) {
    const dnd = ev.dataTransfer;

    // Get dragged piece id
    const id = dnd.getData(mime);

    // Throw exception if text is dropped
    if(!getElement(id)) throw "ಠ_ಠ";
    return id;
}

export function replacePiece(rank, file, piece, board) {
    setPiece(piece, board, rank, file);
}

export function replacePieceByLoc(loc, piece, board) {
    replacePiece(Loc.rank(loc), Loc.file(loc), piece, board);
}

export function replacePieceById(id, piece, board) {
    const data = getElementData(id);
    replacePiece(parseInt(data.rank), parseInt(data.file), piece, board);
}

export function removePiece(rank, file, board) {
    setPiece(_, board, rank, file);
}

export function removePieceByLoc(loc, board) {
    removePiece(Loc.rank(loc), Loc.file(loc), board);
}

export function removePieceById(id, board) {
    const data = getElementData(id);
    removePiece(parseInt(data.rank), parseInt(data.file), board);
}
