import * as Castle from './castle.js';
import * as Piece from './piece.js';
import * as Location from './location.js';
import * as EnPassant from './en-passant.js';
import * as Filter from './filter.js';
import * as FEN from './fen.js';
import * as ID from './id.js';
import * as Clock from './clock.js';
import * as State from './state.js';
import * as GamePos from './game-position.js';
import * as Move from './move.js';
import { Color, White, Black, opponentOf } from './color.js';
import { Position, get, getByLocation } from './position.js';
import { Size as size } from './size.js';
import { nthRank } from './rank.js';
import { TypePawn } from './piece-type.js';
import { getKingLocation } from './game-position-util.js';
import * as Err from './analysis-error.js';


type PieceCount = {[piece: string]: number};
type PosRepeat = {[id: string]: number};


export interface SetupState extends State.State {
    fen: string,
    id: string,
};

export interface GameState extends SetupState {
    count: PieceCount,
    repeat: PosRepeat,
    moves: Move.Move,
};

export interface GameMove {
    from: Location.Location,
    to: Location.Location,
    pgn: string,
};


export class Game {
    private started: boolean;
    private setupValid: boolean;

    private setup: SetupState;
    private game: GameState[];
    private moves: GameMove[];

    constructor() {
        this.started = false;
        this.setupValid = true; 
        
        this.setup = this.setupStateOf(State.New());
        this.game = [];
        this.moves = [];
    }

    getGameState(fullmove: number, color: Color): GameState | null {
        const idx = this.gameStateIdx(fullmove, color);
        return idx < 0? null : {...this.game[idx]};
    }

    getInitialGameState(): GameState | null {
        return this.getGameState(0, this.setup.move);
    }

    getSetupState(): SetupState {
        return {...this.setup};
    }

    start() {
        if(!this.setupValid) throw Err.New(Err.InvalidOp, "invalid setup");

        this.game.push(this.setupGameStateOf(this.setup));
        this.started = true;
    }

    resetSetup() {
        if(this.started) throw Err.New(Err.InvalidOp, "game has started");

        this.setup = this.setupStateOf(State.New());
        this.setupValid = true;
    }

    loadSetup(s: State.State) {
        if(this.started) throw Err.New(Err.InvalidOp, "game has started");
        
        this.setup = this.setupStateOf(this.validStateOf(s));
        this.setupValid = false;
    }

    validateSetup() {
        if(this.started) throw Err.New(Err.InvalidOp, "game has started");

        // Clock: Max halfmove should not be exceeded
        const clock = this.setup.clock;
        if(clock.halfmove > Clock.MaxHalfmove) throw Err.New(Err.InvalidHalfmove, "invalid halfmove");
        
        // Position:
        // 1. Count king for both sides, each side should have exactly 1 king
        // 2. No pawn in 1st rank of both sides
        // 3. Validate check
        this.setupValidateKingCount(this.setup.pos);
        this.setupValidatePawnRank(this.setup.pos);
        this.setupValidateCheck(this.setup.move, this.setup.pos);

        this.setupValid = true;
    }    

    private gameStateIdx(fullmove: number, color: Color): number {
        const setupFullmove = this.setup.clock.fullmove;
        if(fullmove < setupFullmove) return 0;

        let offset = 1;
        offset += color === Black? 1 : 0;
        offset += this.setup.move === Black? -1 : 0;

        return 2*(fullmove - setupFullmove) + offset;
    }

    // private moveIdx(fullmove: number, color: Color): number {
    //     const idx = this.gameStateIdx(fullmove, color)-1;
    //     return idx < 0? -1 : idx;
    // }

    private validStateOf(s: State.State): State.State {
        let st = {...s};

        let clock = st.clock;
        if(clock.fullmove === 0) clock.fullmove = Clock.FullmoveStart;

        let rights = st.castle;
        for(const type in rights) {
            if(rights[type]) {
                const c = Castle.get(type);
                const kingMoved = getByLocation(st.pos, c.king.from) !== c.king.piece;
                const rookMoved = getByLocation(st.pos, c.rook.from) !== c.rook.piece;

                if(kingMoved || rookMoved) rights[type] = false;
            }
        }

        const none = Location.None;
        if(st.enPassant !== none) {
            const valid = this.isValidEnPassantTarget(st.enPassant, st.move, st.pos);
            if(!valid) st.enPassant = none;
        }

        return st;
    }

    private setupStateOf(s: State.State): SetupState {
        const fen = FEN.generate(s);
        const id = ID.generateFromFEN(fen);

        return {...s, fen: fen, id: id};
    }

    private setupGameStateOf(s: SetupState): GameState {
        const count = this.setupPieceCount(s.pos);
        const repeat: PosRepeat = {[s.id]: 1};

        const moves = this.generateLegalMoves(s);
        return {...s, count: count, repeat: repeat, moves: moves};
    }

    private generateLegalMoves(s: State.State): Move.Move {
        return Move.generate(s);
    }

    private isValidEnPassantTarget(target: Location.Location, player: Color, pos: Position): boolean {
        const rank = Location.rank(target);
        const file = Location.file(target);
        
        const targetRank = EnPassant.targetRank(player);
        if(rank !== targetRank) return false;
        
        const opponent = opponentOf(player);
        const opponentPawnLoc = EnPassant.opponentPawnLoc(file, player);
        
        const pawns = Filter.New(Piece.getList(), Piece.byType(TypePawn))();
        const opponentPawn = Filter.New(pawns, Piece.byColor(opponent))()[0].letter;
        
        if(getByLocation(pos, opponentPawnLoc) !== opponentPawn) return false;
        
        const playerPawn = Filter.New(pawns, Piece.byColor(player))()[0].letter;
        const playerPawnsLoc = EnPassant.playerPawnsLoc(file, player);

        for(const loc of playerPawnsLoc) {
            if(getByLocation(pos, loc) === playerPawn) return true;
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
            if(cnt[color] !== 1) throw Err.New(Err.InvalidKingCount, `invalid ${color} king count`);
        }
    }

    private setupValidatePawnRank(pos: Position) {
        const n: number = 1;
        const ranks: number[] = [nthRank(n, White), nthRank(n, Black)];
        
        const whitePawn = Piece.WhitePawn.letter;
        const blackPawn = Piece.BlackPawn.letter;

        for(const rank of ranks) {
            for(let file = 1; file <= size; file++) {
                const piece = get(pos, rank, file);

                if(piece === whitePawn || piece === blackPawn) {
                    throw Err.New(Err.InvalidPawnRank, `no pawns allowed in rank ${rank}`);
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
        if(opponentAttackers.length > 0) throw Err.New(Err.InvalidPosition, `${opponent} king can't be in check`);
        
        // 2. If player is in check, there should be at most 2 attackers
        const attackers = GamePos.analyzeAttackOn(pos, player, playerKingLoc);
        if(attackers.length > 2) throw Err.New(Err.InvalidPosition, "too many checking pieces");
    }
};
