import * as Castle from './castle.js';
import * as Piece from './piece.js';
import { Position, get, set } from './position.js';


const P = Piece.WhitePawn.letter;
const p = Piece.BlackPawn.letter;


export function hasCastlePosition(pos: Position, type: string) {
    const castle = Castle.get(type);
    const king = castle.king;
    const rook = castle.rook;

    return get(pos, king.square.rank, king.square.file) === king.piece &&
        get(pos, rook.square.rank, rook.square.file) === rook.piece;
}