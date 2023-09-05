import * as Piece from './piece.js';
import * as Loc from './location.js';
import * as FEN from './fen.js';
import * as StateID from './state-id.js';
import * as Clock from './clock.js';
import * as Attack from './attack.js';
import * as Move from './move.js';
import * as Promotion from './promotion.js';
import * as Result from './game-result.js';
import * as Pieces from './pieces.js';
import * as Castles from './castles.js';
import * as EnPassant from './en-passant.js';
import * as MoveType from './move-type.js';
import { Size as size } from './size.js';
import { nthRank } from './rank.js';
import { Position, get, getByLoc } from './position.js';
import { State as state, New as newState } from './state.js';
import { Type, TypeKing, TypePawn, TypeQueen } from './piece-type.js';
import { getEnPassantPawns } from './position-util.js';
import { Setup, State, GameMove, PieceCount, StateCount } from './game-data.js';
import { Color, White, Black, opponentOf, getList as getColors } from './color.js';
import * as Err from './analysis-error.js';


type Location = Loc.Location;
type MoveType = MoveType.Type;


export class Game {
    private started: boolean;
    private setupValid: boolean;

    private setup: Setup;
    private game: State[];
    private moves: GameMove[];

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

    getInitialStateData(): State | null {
        if(this.game.length === 0) return null;
        return {...this.game[0]};
    }

    start() {
        if(!this.setupValid) throw Err.New(Err.InvalidOp, "invalid setup");

        this.game.push(this.stateDataOf(this.setup));
        this.evaluateLegalMoves(this.game.length-1);
        this.started = true;
    }

    move(from: Location, to: Location, promoted: Type = TypeQueen) {
        if(!this.started) throw Err.New(Err.InvalidOp, "game not started");
        
        const idx = this.game.length-1;
        const st = this.game[idx];

        if(!this.isValidMove(from, to, st)) throw Err.New(Err.InvalidMove, "invalid move");
        if(!this.isValidPromotedPiece(promoted)) throw Err.New(Err.InvalidPromotion, "invalid piece");

        console.log(this.getMoveType(from, to, st));
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
        if(clock.halfmove > Clock.MaxHalfmove) throw Err.New(Err.SetupHalfmove, "invalid halfmove");
        
        // Position:
        // 1. Count king for both sides, each side should have exactly 1 king
        // 2. No pawn allowed in 1st rank or promotion rank for both sides
        // 3. Validate check
        this.setupValidateKingCount(this.setup.pos);
        this.setupValidatePawnRank(this.setup.pos);
        this.setupValidateCheck(this.setup.move, this.setup.pos);

        this.setupValid = true;
    }

    private isValidMove(from: Location, to: Location, st: State): boolean {
        const moves = st.moves;
        return from in moves && moves[from].includes(to);
    }

    private isValidPromotedPiece(promoted: Type): boolean {
        return Promotion.canPromoteTo(promoted);
    }

    private getMoveType(from: Location, to: Location, st: State): MoveType {
        const piece = Pieces.get(getByLoc(st.pos, from));
        const color = st.move;
        
        if(piece.type === TypeKing) {
            const castle = Castles.getByColor(color);
            for(const c of castle) {
                const dest = c.king.from + c.king.squares * c.king.direction;
                if(from === c.king.from && to === dest) return MoveType.Castle;
            }
        }
        
        if(piece.type === TypePawn) {
            const promoteRank = Promotion.promoteRank(color);
            if(Loc.rank(to) === promoteRank) return MoveType.Promotion;
            if(to === st.enPassant) return MoveType.EnPassant;
        }

        return MoveType.Normal; 
    }

    private evaluateLegalMoves(idx: number) {
        const st = this.game[idx];
        


        // TODO: Change
        st.ended = false;
        st.moves = Move.getLegalMoves(st);
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
        let st = {...s};

        let clock = st.clock;
        if(clock.fullmove === 0) clock.fullmove = Clock.FullmoveStart;

        let rights = st.castle;
        for(const type in rights) {
            if(!rights[type]) continue;

            const c = Castles.get(type);
            const kingMoved = getByLoc(st.pos, c.king.from) !== c.king.piece;
            const rookMoved = getByLoc(st.pos, c.rook.from) !== c.rook.piece;

            if(kingMoved || rookMoved) rights[type] = false;
        }

        const none = Loc.None;
        if(st.enPassant !== none) {
            const valid = this.isValidEnPassantTarget(st.enPassant, st.move, st.pos);
            if(!valid) st.enPassant = none;
        }

        return st;
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

    private isValidEnPassantTarget(target: Location, player: Color, pos: Position): boolean {
        const file = Loc.file(target);

        const opponentFromLoc = EnPassant.opponentPawnFromLoc(file, player);
        if(getByLoc(pos, opponentFromLoc) !== Piece.None) return false;
        if(getByLoc(pos, target) !== Piece.None) return false;

        const colors = getColors();
        const pawns = getEnPassantPawns(file, pos, player);

        for(const color of colors) {
            if(pawns[color].length === 0) return false;
        }
        return true;
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
