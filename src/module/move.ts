import * as Location from './location.js';
import * as Piece from './piece.js';
import * as PieceMove from './piece-move.js';
import { State } from './state.js';
import { Size as size } from './size.js';
import { Color, opponentOf } from './color.js';
import { Position, getByLocation } from './position.js';
import { outOfBound } from './game-position-util.js';
import { TypeRange } from './piece-move.js';
import { TypeKing } from './piece-type.js';



type Loc = Location.Location;
export type Move = {[loc: Loc]: Loc[]}


export function generate(s: State): Move {
    return generatePieceMoves(s.pos, s.move);
}

function generatePieceMoves(pos: Position, color: Color): Move {
    let moves: Move = {};

    for(let rank = 1; rank <= size; rank++) {
        for(let file = 1; file <= size; file++) {
            const loc = Location.of(file, rank);
            const current = getByLocation(pos, loc);
            if(current === Piece.None) continue;

            const piece = Piece.get(current);
            if(piece.color !== color) continue;
            
            const getMovesFn = (piece.attack === TypeRange)? getRangeMoves : getDirectMoves;
            moves[loc] = getMovesFn(pos, loc, color);
        }
    }

    return moves;
}

function getDirectMoves(pos: Position, loc: Loc, color: Color): Loc[] {
    let moves: Loc[] = [];
    
    const opponent = opponentOf(color);
    const piece = Piece.get(getByLocation(pos, loc));

    for(const move of piece.moves) {
        for(const direction of move.directions) {
            const square = loc + direction;

            if(outOfBound(square)) continue;
            if(canOccupy(square, pos, move, opponent)) moves.push(square);
        }
    }

    return moves;
}

function getRangeMoves(pos: Position, loc: Loc, color: Color): Loc[] {
    let moves: Loc[] = [];

    const opponent = opponentOf(color);
    const piece = Piece.get(getByLocation(pos, loc));

    for(const move of piece.moves) {
        for(const direction of move.directions) {
            let square = loc;

            while(!outOfBound(square += direction)) {
                if(canOccupy(square, pos, move, opponent)) moves.push(square);
                if(getByLocation(pos, square) !== Piece.None) break;
            }
        }
    }

    return moves;
}

function canOccupy(square: Loc, pos: Position, move: PieceMove.Move, opponent: Color): boolean {
    if(move.move && canMoveTo(square, pos)) return true;
    if(move.capture && canCaptureOn(square, pos, opponent)) return true;
    return false;
}

function canMoveTo(square: Loc, pos: Position): boolean {
    return getByLocation(pos, square) === Piece.None;
}

function canCaptureOn(square: Loc, pos: Position, opponent: Color): boolean {
    const target = getByLocation(pos, square);
    if(target === Piece.None) return false;

    const piece = Piece.get(target);
    return piece.color === opponent && piece.type !== TypeKing;
}
