import * as Loc from './location.js';
import * as Piece from './piece.js';
import * as PieceMove from './piece-move.js';
import * as Castle from './castle.js';
import * as EnPassant from './en-passant.js';
import { State } from './state.js';
import { Size as size } from './size.js';
import { Color, opponentOf } from './color.js';
import { Position, getByLoc } from './position.js';
import { nthRank } from './rank.js';
import { outOfBound } from './game-position-util.js';
import { TypeRange } from './piece-move.js';
import { TypeKing, TypePawn } from './piece-type.js';


type Loc = Loc.Location;


export type Moves = {[loc: Loc]: Loc[]}

export function generate(s: State): Moves {
    return mergeMoves(generatePieceMoves(s.pos, s.move), generateSpecialMoves(s.pos, s.move, s.castle, s.enPassant));
}


function generatePieceMoves(pos: Position, color: Color): Moves {
    let moves: Moves = {};

    for(let rank = 1; rank <= size; rank++) {
        for(let file = 1; file <= size; file++) {
            const loc = Loc.of(file, rank);

            const current = getByLoc(pos, loc);
            if(current === Piece.None) continue;

            const piece = Piece.get(current);
            if(piece.color !== color) continue;
            
            const getMovesFn = piece.attack === TypeRange? getRangeMoves : getDirectMoves;
            moves[loc] = getMovesFn(pos, loc, color);
        }
    }

    return moves;
}

function generateSpecialMoves(pos: Position, color: Color, rights: Castle.Rights, enPassant: Loc): Moves {
    return {...getTwoRankPawnMoves(pos, color), ...getCastleMoves(pos, rights, color), ...getEnPassantMoves(pos, enPassant, color)};
}

function getDirectMoves(pos: Position, loc: Loc, color: Color): Loc[] {
    let moves: Loc[] = [];
    
    const opponent = opponentOf(color);
    const piece = Piece.get(getByLoc(pos, loc));

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
    const piece = Piece.get(getByLoc(pos, loc));

    for(const move of piece.moves) {
        for(const direction of move.directions) {
            let square = loc;

            while(!outOfBound(square += direction)) {
                if(canOccupy(square, pos, move, opponent)) moves.push(square);
                if(getByLoc(pos, square) !== Piece.None) break;
            }
        }
    }

    return moves;
}

function getTwoRankPawnMoves(pos: Position, color: Color): Moves {
    let moves: Moves = {};

    const n = 2;
    const rank = nthRank(n, color);

    for(let file = 1; file <= size; file++) {
        const loc = Loc.of(file, rank)

        const current = getByLoc(pos, loc);
        if(current === Piece.None) continue;

        const piece = Piece.get(current);
        if(piece.color !== color || piece.type !== TypePawn) continue;

        const oneAhead = Loc.of(file, nthRank(n+1, color));
        const twoAhead = Loc.of(file, nthRank(n+2, color));
        if(canMoveTo(oneAhead, pos) && canMoveTo(twoAhead, pos)) moves[loc] = [twoAhead];
    }

    return moves;
}

function getCastleMoves(pos: Position, rights: Castle.Rights, color: Color): Moves {
    let moves: Moves = {};
    
    for(let type in rights) {
        if(rights[type]) {
            const castle = Castle.get(type);
            const king = castle.king;
            const rook = castle.rook;

            if(castle.color !== color) continue;
            if(getByLoc(pos, king.from) !== king.piece) continue;
            if(getByLoc(pos, rook.from) !== rook.piece) continue;

            let clear = true;

            for(let loc = rook.from; loc != king.from; loc += rook.direction) {
                if(loc === rook.from) continue;
                if(getByLoc(pos, loc) !== Piece.None) clear = false;
            }
            if(clear) {
                if(!(king.from in moves)) moves[king.from] = [];
                moves[king.from].push(king.from + king.squares*king.direction);
            }
        }
    }

    return moves;
}

function getEnPassantMoves(pos: Position, enPassant: Loc, color: Color): Moves {
    let moves: Moves = {};
    
    if(enPassant != Loc.None) {
        const file = Loc.file(enPassant);
        const playerPawnsLoc = EnPassant.playerPawnsLoc(file, color);

        for(const loc of playerPawnsLoc) {
            if(getByLoc(pos, loc) !== Piece.None) moves[loc] = [enPassant];
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
    return getByLoc(pos, square) === Piece.None;
}

function canCaptureOn(square: Loc, pos: Position, opponent: Color): boolean {
    const target = getByLoc(pos, square);
    if(target === Piece.None) return false;

    const piece = Piece.get(target);
    return piece.color === opponent && piece.type !== TypeKing;
}

function mergeMoves(...moves: Moves[]): Moves {
    let res: Moves = {};

    for(const move of moves) {
        for(const square in move) {
            if(!(square in res)) res[square] = [];
            res[square].push(...move[square]);
        }
    }
    return res;
}