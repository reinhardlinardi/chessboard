import * as Piece from '../module/piece.js';
import * as Color from '../module/color.js';

export const topTray = Piece.getTypes(Color.Black).map(piece => piece.letter);
export const bottomTray = Piece.getTypes(Color.White).map(piece => piece.letter);