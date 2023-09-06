import * as Piece from './piece.js';
import * as Loc from './location.js';
import * as FEN from './fen.js';
import * as StateID from './state-id.js';
import * as Attack from './attack.js';
import * as Promotion from './promotion.js';
import * as Castle from './castle.js';
import * as Result from './game-result.js';
import * as Pieces from './pieces.js';
import * as Castles from './castles.js';
import * as EnPassant from './en-passant.js';
import { FullmoveStart, MaxHalfmove } from './clock.js';
import { Size as size } from './size.js';
import { nthRank } from './rank.js';
import { Moves, getLegalMoves } from './move.js';
import { State as state, New as newState } from './state.js';
import { Position, get, getByLoc, setByLoc } from './position.js';
import { Type, TypeKing, TypePawn, TypeQueen, TypeRook } from './piece-type.js';
import { Setup, State, Move, PieceCount, StateCount } from './game-data.js';
import { Color, White, Black, opponentOf, getList as getColors } from './color.js';
import { isCastleAllowed, isValidEnPassantTarget } from './game-util.js';
import * as Err from './analysis-error.js';



type Location = Loc.Location;


export class Game {
    private started: boolean;
    private setupValid: boolean;

    private setup: Setup;
    private game: State[];
    private moves: Move[];

    constructor() {
        this.started = false;
        this.setupValid = true; 
        
        this.setup = this.setupDataOf(newState());
        this.game = [];
        this.moves = [];
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

        this.game.push(this.stateDataOf(this.setup));
        this.evaluateLegalMoves(this.game.length-1);
        this.started = true;
    }

    move(from: Location, to: Location, promoted: Type = TypeQueen) {
        if(!this.started) throw Err.New(Err.InvalidOp, "game not started");
        if(!Promotion.canPromoteTo(promoted)) throw Err.New(Err.InvalidPromotion, "invalid piece");

        const current = this.getCurrentStateData();
        const color = current.move;

        //if(!this.isValidMove(from, to, current.moves)) throw Err.New(Err.InvalidMove, "invalid move");
        
        // const next = {...current};

        // if(color === Black) next.clock.fullmove++;

        // const pos = next.pos;

        

        // this.movePiece(from, to, pos);
        // if(this.isPromotion(pos, from, to, color)) this.promotePiece(to, promoted, pos, color);

        // this.updateCastleRights(pos, next.castle);
        // // update halfmove
        // // update fullmove
        

        // const opponent = opponentOf(color);
        // next.move = opponent;
        // next.enPassant = this.getEnPassantTarget(pos, color, current.enPassant);

        // this.game.push(next);
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

    // private isValidMove(from: Location, to: Location, moves: Moves): boolean {
    //     return from in moves && moves[from].includes(to);
    // }

    // private isPromotion(pos: Position, from: Location, to: Location, color: Color) {
    //     const piece = Pieces.get(getByLoc(pos, from));
    //     const rank = Loc.rank(to);
    //     const promoteRank = Promotion.promoteRank(color);

    //     return piece.type === TypePawn && rank === promoteRank;
    // }

    // private movePiece(from: Location, to: Location, pos: Position) {
    //     setByLoc(Piece.None, pos, from);
    //     setByLoc(getByLoc(pos, from), pos, to);
    // }

    // private promotePiece(loc: Location, promoted: Type, pos: Position, color: Color) {
    //     const piece = Pieces.getBy(color, promoted).letter;
    //     setByLoc(piece, pos, loc);
    // }
    
    // private updateCastleRights(pos: Position, rights: Castle.Rights) {
    //     for(const type in rights) {
    //         const canCastle = this.castleAllowed(type, rights, pos);
    //         if(!canCastle) rights[type] = false;
    //     }
    // }

    // private getEnPassantTarget(pos: Position, color: Color, enPassant: Location): Location {
    //     if(enPassant === Loc.None) {
    //         const rank = EnPassant.targetRank(color);
    //         for(let file = 1; file <= size; file++) {
    //             const target = Loc.of(file, rank);
    //             if(this.isValidEnPassantTarget(target, color, pos)) return target;
    //         }
    //     }

    //     return Loc.None;
    // }

    

    private evaluateLegalMoves(idx: number) {
        const st = this.game[idx];

        // TODO: Change
        st.ended = false;
        st.moves = getLegalMoves(st);
    }

    // TODO: Implement
    // 1. Check if player in check, then check if checkmated
    // 2. Check draws: 3-fold repetition, 50-move rule, insufficient material
    // 3. Generate legal moves, if 0 legal moves, then draw by stalemate

    private getPieceCount(pos: Position): PieceCount {
        let count: PieceCount = Pieces.getList().reduce((map, piece) => ({...map, [piece.letter]: 0}), {});

        for(let rank = 1; rank <= size; rank++) {
            for(let file = 1; file <= size; file++) {
                const piece = get(pos, rank, file);
                if(piece !== Piece.None) count[piece]++;
            }
        }
        return count;
    }

    private validStateOf(s: state): state {
        let v = {...s};

        v.clock.fullmove = Math.max(v.clock.fullmove, FullmoveStart);
        if(!isValidEnPassantTarget(v.enPassant, v.move, v.pos)) v.enPassant = Loc.None;

        for(const type in v.castle) {
            if(!isCastleAllowed(type, v.castle, v.pos)) v.castle[type] = false;
        }
        return v;
    }

    private setupDataOf(s: state): Setup {
        const fen = FEN.generate(s);
        const id = StateID.generateFromFEN(fen);

        return {...s, fen: fen, id: id};
    }

    private stateDataOf(s: Setup): State {
        const ended = false;
        const result = {score: 0, reason: 0};
        
        const pieces = this.getPieceCount(s.pos);
        const repeat: StateCount = {[s.id]: 1};
        
        return {...s, ended: ended, result: result, pieces: pieces, repeat: repeat, moves: {}};
    }

    private setupValidateKingCount(pos: Position) {
        let cnt: {[c: Color]: number} = {[White]: 0, [Black]: 0};

        const whiteKing = Piece.WhiteKing.letter;
        const blackKing = Piece.BlackKing.letter;

        for(let rank = 1; rank <= size; rank++) {
            for(let file = 1; file <= size; file++) {
                const piece = get(pos, rank, file);

                if(piece === whiteKing) cnt[White]++;
                if(piece === blackKing) cnt[Black]++;
            }
        }

        for(const color in cnt) {
            if(cnt[color] !== 1) throw Err.New(Err.SetupKingCount, "invalid king count");
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
