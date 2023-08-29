import * as Castle from './castle.js';
import * as Piece from './piece.js';
import * as Loc from './location.js';
import * as EnPassant from './en-passant.js';
import * as Filter from './filter.js';
import * as FEN from './fen.js';
import * as StateID from './state-id.js';
import * as Clock from './clock.js';
import * as GamePos from './game-position.js';
import * as GameMove from './move.js';
import * as Promotion from './promotion.js';
import * as Result from './game-result.js';
import { Color, White, Black, opponentOf } from './color.js';
import { Position, get, getByLoc } from './position.js';
import { Size as size } from './size.js';
import { State as state, New as newState } from './state.js';
import { nthRank } from './rank.js';
import { TypePawn } from './piece-type.js';
import { getKingLocation } from './game-position-util.js';
import { Setup, State, Move, PieceCount, StateCount } from './game-data.js';
import * as Err from './analysis-error.js';


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

    getInitialStateData(): State | null {
        if(this.game.length === 0) return null;
        return {...this.game[0]};
    }

    getCurrentStateData(): State | null {
        if(this.game.length === 0) return null;
        return {...this.currentStateData()};
    }
    
    // getStateData(fullmove: number, color: Color): State | null {
    //     const idx = this.gameStateIdx(fullmove, color);
    //     return idx < 0? null : {...this.game[idx]};
    // }

    start() {
        if(!this.setupValid) throw Err.New(Err.InvalidOp, "invalid setup");

        this.game.push(this.stateDataOf(this.setup));
        this.evalPosition();
        this.started = true;
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
        if(clock.halfmove > Clock.MaxHalfmove) throw Err.New(Err.SetupInvalidHalfmove, "invalid halfmove");
        
        // Position:
        // 1. Count king for both sides, each side should have exactly 1 king
        // 2. No pawn in 1st rank of both sides
        // 3. Validate check
        this.setupValidateKingCount(this.setup.pos);
        this.setupValidatePawnRank(this.setup.pos);
        this.setupValidateCheck(this.setup.move, this.setup.pos);

        this.setupValid = true;
    }

    private currentStateData() {
        return this.game[this.game.length-1];
    }

    private evalPosition() {
        const current = this.currentStateData();
        
        // TODO: Implement
        // 1. Check if player in check, then check if checkmated
        // 2. Check draws: 3-fold repetition, 50-move rule, insufficient material
        // 3. Generate legal moves, if 0 legal moves, then draw by stalemate

        // TODO: Change
        current.ended = false;
        current.moves = this.generateLegalMoves(current);
    }

    private generateLegalMoves(s: state): GameMove.Moves {
        return GameMove.generate(s);
    }

    private validStateOf(s: state): state {
        let st = {...s};

        let clock = st.clock;
        if(clock.fullmove === 0) clock.fullmove = Clock.FullmoveStart;

        let rights = st.castle;
        for(const type in rights) {
            if(rights[type]) {
                const c = Castle.get(type);
                const kingMoved = getByLoc(st.pos, c.king.from) !== c.king.piece;
                const rookMoved = getByLoc(st.pos, c.rook.from) !== c.rook.piece;

                if(kingMoved || rookMoved) rights[type] = false;
            }
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
        const pieces = this.setupPieceCount(s.pos);
        const repeat: StateCount = {[s.id]: 1};

        return {...s, ended: false, result: 0, pieces: pieces, repeat: repeat, moves: {}};
    }

    private isValidEnPassantTarget(target: Loc.Location, player: Color, pos: Position): boolean {
        const rank = Loc.rank(target);
        const file = Loc.file(target);
        
        const targetRank = EnPassant.targetRank(player);
        if(rank !== targetRank) return false;
        
        const opponent = opponentOf(player);
        const opponentPawnLoc = EnPassant.opponentPawnLoc(file, player);
        
        const pawns = Filter.New(Piece.getList(), Piece.byType(TypePawn))();
        const opponentPawn = Filter.New(pawns, Piece.byColor(opponent))()[0].letter;
        
        if(getByLoc(pos, opponentPawnLoc) !== opponentPawn) return false;
        
        const playerPawn = Filter.New(pawns, Piece.byColor(player))()[0].letter;
        const playerPawnsLoc = EnPassant.playerPawnsLoc(file, player);

        for(const loc of playerPawnsLoc) {
            if(getByLoc(pos, loc) === playerPawn) return true;
        }
        
        return false;
    }

    private setupPieceCount(pos: Position): PieceCount {
        let count: PieceCount = Piece.getList().reduce((map, piece) => ({...map, [piece.letter]: 0}), {});

        for(let rank = 1; rank <= size; rank++) {
            for(let file = 1; file <= size; file++) {
                const piece = get(pos, rank, file);
                if(piece !== Piece.None) count[piece]++;
            }
        }
        return count;
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
            if(cnt[color] !== 1) throw Err.New(Err.SetupInvalidKingCount, `invalid ${color} king count`);
        }
    }

    private setupValidatePawnRank(pos: Position) {
        const colors: Color[] = [White, Black];

        for(const color of colors) {
            const ranks = [nthRank(1, color), Promotion.promoteRank(color)];

            for(const rank of ranks) {
                for(let file = 1; file <= size; file++) {
                    const subject = get(pos, rank, file);
                    if(subject === Piece.None) continue;

                    const piece = Piece.get(subject);
                    if(piece.color === color && piece.type === TypePawn) {
                        throw Err.New(Err.SetupInvalidPawnRank, `${color} pawn not allowed in rank ${rank}`);
                    }
                }
            }
        }
    }

    private setupValidateCheck(player: Color, pos: Position) {
        const opponent = opponentOf(player);

        // Locate both kings
        const playerKingLoc = getKingLocation(pos, player);
        const opponentKingLoc = getKingLocation(pos, opponent);

        // Validation:
        // 1. Player is not checking opponent king
        const opponentAttackers = GamePos.analyzeAttackOn(pos, opponent, opponentKingLoc);
        if(opponentAttackers.length > 0) throw Err.New(Err.SetupInvalidPosition, `${opponent} king can't be in check`);
        
        // 2. If player is in check, there should be at most 2 attackers
        const attackers = GamePos.analyzeAttackOn(pos, player, playerKingLoc);
        if(attackers.length > 2) throw Err.New(Err.SetupInvalidPosition, "too many checking pieces");
    }

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
