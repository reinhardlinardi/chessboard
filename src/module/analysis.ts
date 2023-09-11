import * as Piece from './piece.js';
import * as Loc from './location.js';
import * as FEN from './fen.js';
import * as StateID from './state-id.js';
import * as Attack from './attack.js';
import * as Promotion from './promotion.js';
import * as Pieces from './pieces.js';
import * as Castles from './castles.js';
import * as game from './game-util.js';
import * as Result from './game-result.js';
import * as Conclusion from './game-conclusion.js';
import * as Notation from './move-notation.js';
import { Size as size } from './size.js';
import { nthRank } from './rank.js';
import { isThreefold } from './repetition.js';
import { isDead } from './dead-position.js';
import { State as state, New as newState } from './state.js';
import { Setup, State, StateCount } from './game-state.js';
import { PieceCount, getEnPassantPawns, getPieceCount } from './position-util.js';
import { Moves, getLegalMoves, hasLegalMoves } from './move.js';
import { HalfmoveStart, FullmoveStart, MaxHalfmove } from './clock.js';
import { Position, get, getByLoc, setByLoc, copy } from './position.js';
import { Type, TypeKing, TypePawn, TypeQueen } from './piece-type.js';
import { Color, White, Black, opponentOf, getList as getColors } from './color.js';
import * as Err from './analysis-error.js';


type Location = Loc.Location;


export class Game {
    private started: boolean;
    private setupValid: boolean;

    private setup: Setup;
    private game: State[];

    constructor() {
        this.started = false;
        this.setupValid = true; 
        
        this.setup = this.setupDataOf(newState());
        this.game = [];
    }

    getSetupData(): Setup {
        return {...this.setup};
    }

    getInitialStateData(): State {
        return {...this.game[0]};
    }

    getCurrentStateData(): State {
        return {...this.game[this.game.length-1]}; 
    }

    start() {
        if(!this.setupValid) throw Err.New(Err.InvalidOp, "invalid setup");
        if(this.started) throw Err.New(Err.InvalidOp, "game has started");

        const initial = this.stateDataOf(this.setup);
        this.game.push(initial);
        this.started = true;
    }

    move(from: Location, to: Location, promoted: Type = TypeQueen) {
        if(!this.started) throw Err.New(Err.InvalidOp, "game not started");
        if(!Promotion.canPromoteTo(promoted)) throw Err.New(Err.InvalidPromotion, "invalid piece");

        const current = this.getCurrentStateData();
        const pos = current.pos;
        const player = current.move;

        if(!game.isValidMove(from, to, current.moves)) throw Err.New(Err.InvalidMove, "invalid move");

        const next = this.copyStateData(current);
        const opponent = opponentOf(player);
        next.move = opponent;
        
        const isPawnMove = game.isPawnMove(pos, from);
        const isCaptureMove = game.isCaptureMove(pos, to);
        
        next.clock.halfmove = isPawnMove || isCaptureMove? HalfmoveStart : next.clock.halfmove+1;
        next.clock.fullmove += player === Black? 1 : 0;

        next.pos = this.movePiece(pos, player, from, to, current.enPassant, promoted);
        next.enPassant = game.getEnPassantTargetFor(opponent, next.pos, from, to);

        for(const type in next.castle) {
            const allowed = game.isCastleAllowed(type, next.castle, next.pos);
            if(next.castle[type] && !allowed) next.castle[type] = false;
        }

        next.fen = FEN.generate(next);
        next.id = StateID.generateFromFEN(next.fen);
        
        if(!(next.id in next.repeat)) next.repeat[next.id] = 0;
        next.repeat[next.id]++;

        next.pieces = getPieceCount(next.pos);
        next.moves = getLegalMoves(next);

        next.result = this.getResult(next.pos, next.move, next.clock.halfmove, next.pieces, next.repeat, next.moves);

        next.from = from;
        next.to = to;
        next.notation = Notation.of(from, to, promoted, player, pos, next.pos, next.result);

        this.game.push(next);
    }

    resetSetup() {
        if(this.started) throw Err.New(Err.InvalidOp, "game has started");

        this.setup = this.setupDataOf(newState());
        this.setupValid = true;
    }

    loadSetup(s: state) {
        if(this.started) throw Err.New(Err.InvalidOp, "game has started");
        
        this.setup = this.setupDataOf(this.validStateOf(s));
        this.setupValid = false;
    }

    validateSetup() {
        if(this.started) throw Err.New(Err.InvalidOp, "game has started");

        // Clock: Max halfmove should not be exceeded
        const clock = this.setup.clock;
        if(clock.halfmove > MaxHalfmove) throw Err.New(Err.SetupHalfmove, "invalid halfmove");
        
        // Position:
        // 1. Count king for both sides, each side should have exactly 1 king
        // 2. No pawn allowed in 1st rank or promotion rank for both sides
        // 3. Validate check
        this.setupValidateKingCount(this.setup.pos);
        this.setupValidatePawnRank(this.setup.pos);
        this.setupValidateCheck(this.setup.move, this.setup.pos);

        this.setupValid = true;
    }

    private movePiece(pos: Position, player: Color, from: Location, to: Location, enPassant: Location, promoted: Type): Position {
        const updated = copy(pos);

        const isPromotion = game.isPromotion(pos, player, from, to);
        const isCastle = game.isCastleMove(pos, from, to, player);
        const isEnPassant = game.isEnPassantMove(pos, from, to, player, enPassant);
        
        const piece = isPromotion? Pieces.getBy(player, promoted).letter : getByLoc(pos, from);
        setByLoc(piece, updated, to);
        setByLoc(Piece.None, updated, from);

        if(isCastle) {
            const c = Castles.getByKingLoc(to);
            const rookFrom = c.rook.from;
            const rookTo = rookFrom + c.rook.squares * c.rook.direction;

            setByLoc(getByLoc(pos, rookFrom), updated, rookTo);
            setByLoc(Piece.None, updated, rookFrom);
        }

        if(isEnPassant) {
            const opponent = opponentOf(player);
            const opponentLoc = getEnPassantPawns(Loc.file(to), pos, player)[opponent][0];            
            setByLoc(Piece.None, updated, opponentLoc);
        }

        return updated;
    }

    private getResult(pos: Position, player: Color, halfmove: number, pieces: PieceCount, repeat: StateCount, moves: Moves): Result.Result {
        const attacks = Attack.attacksOn(player, pos);
        const inCheck = Attack.isKingAttacked(player, pos, attacks);
        const hasMoves = hasLegalMoves(moves);

        // 1. Check if player has no legal moves, if yes check if player in check
        //    If player in check, then checkmated, else stalemate
        if(!hasMoves) return inCheck? Result.checkmated(player) : Result.draw(Conclusion.Stalemate);

        // 2. Check draws: 3-fold repetition, 50-move rule, insufficient material
        if(isThreefold(repeat)) return Result.draw(Conclusion.Repetition);
        if(halfmove >= MaxHalfmove) return Result.draw(Conclusion.FiftyMove);
        if(isDead(pieces)) return Result.draw(Conclusion.Insufficient);

        return Result.playInProgress();
    }

    private copyStateData(src: State): State {
        const copy = {...src};

        copy.pos = [];
        copy.castle = {...src.castle};
        copy.clock = {...src.clock};
        copy.pieces = {};
        copy.repeat = {...src.repeat};
        copy.moves = {};

        return copy; 
    }

    private validStateOf(s: state): state {
        let v = {...s};

        // Overwrite :
        // 1. Fullmove clock if value = 0
        if(v.clock.fullmove === 0) v.clock.fullmove = FullmoveStart;

        // 2. Invalid en passant target
        const isValidEnPassant = game.isValidEnPassantTarget(v.enPassant, v.move, v.pos);
        if(!isValidEnPassant) v.enPassant = Loc.None;
        
        // 3. Invalid castle rights
        for(const type in v.castle) {
            const castleAllowed = game.isCastleAllowed(type, v.castle, v.pos);
            if(!castleAllowed) v.castle[type] = false;
        }

        return v;
    }

    private setupDataOf(s: state): Setup {
        const fen = FEN.generate(s);
        const id = StateID.generateFromFEN(fen);

        return {...s, fen: fen, id: id};
    }

    private stateDataOf(s: Setup): State {
        const pieces = getPieceCount(s.pos);
        const repeat: StateCount = {[s.id]: 1};
        const moves = getLegalMoves(s);

        const result = this.getResult(s.pos, s.move, s.clock.halfmove, pieces, repeat, moves);

        const from = Loc.None;
        const to = Loc.None;
        const notation = Notation.None;
        
        return {...s, result: result, pieces: pieces, repeat: repeat, moves: moves, from: from, to: to, notation: notation};
    }

    private setupValidateKingCount(pos: Position) {
        const cnt = getPieceCount(pos);
        const kings = [Pieces.getBy(White, TypeKing).letter, Pieces.getBy(Black, TypeKing).letter];

        for(const king of kings) {
            if(cnt[king] !== 1) throw Err.New(Err.SetupKingCount, "invalid king count");
        }
    }

    private setupValidatePawnRank(pos: Position) {
        const colors = getColors();

        for(const color of colors) {
            const ranks = [nthRank(1, color), Promotion.promoteRank(color)];

            for(const rank of ranks) {
                for(let file = 1; file <= size; file++) {
                    const subject = get(pos, rank, file);
                    if(subject === Piece.None) continue;

                    const piece = Pieces.get(subject);
                    if(piece.color === color && piece.type === TypePawn) {
                        throw Err.New(Err.SetupPawnRank, `no pawns allowed in rank ${rank}`);
                    }
                }
            }
        }
    }

    private setupValidateCheck(player: Color, pos: Position) {
        const opponent = opponentOf(player);
        const attacks = Attack.attacksOn(player, pos);
        const opponentAttacks = Attack.attacksOn(opponent, pos);

        const opponentInCheck = Attack.isKingAttacked(opponent, pos, opponentAttacks);
        const numKingAttackers = Attack.numKingAttackersOf(player, pos, attacks);

        // Validation:
        // 1. Player is not checking opponent king
        if(opponentInCheck) throw Err.New(Err.SetupPosition, "opponent king can't be in check");

        // 2. If player is in check, there should be at most 2 attackers
        if(numKingAttackers > 2) throw Err.New(Err.SetupPosition, "too many checking pieces");
    }

    // getStateData(fullmove: number, color: Color): State | null {
    //     const idx = this.gameStateIdx(fullmove, color);
    //     return idx < 0? null : {...this.game[idx]};
    // }

    // private stateIdx(fullmove: number, color: Color): number {
    //     const setupFullmove = this.setup.clock.fullmove;
    //     if(fullmove < setupFullmove) return 0;

    //     let offset = 1;
    //     offset += color === Black? 1 : 0;
    //     offset += this.setup.move === Black? -1 : 0;

    //     return 2*(fullmove - setupFullmove) + offset;
    // }

    // private moveIdx(fullmove: number, color: Color): number {
    //     const idx = this.gameStateIdx(fullmove, color)-1;
    //     return idx < 0? -1 : idx;
    // }
};
