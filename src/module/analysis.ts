import * as Castle from './castle.js';
import * as Piece from './piece.js';
import * as Location from './location.js';
import * as EnPassant from './en-passant.js';
import * as Filter from './filter.js';
import * as FEN from './fen.js';
import * as ID from './id.js';
import * as Clock from './clock.js';
import * as GamePos from './game-position.js';
import { State } from './state.js';
import { Color, White, Black, opponentOf } from './color.js';
import { Position, get, getByLocation } from './position.js';
import { Size as size } from './size.js';
import { nthRank } from './rank.js';
import * as Err from './analysis-error.js';


export interface GameState extends State {
    fen: string,
    id: string,
    
    from: Location.Location,
    to: Location.Location,
    count: {[id: string]: number},
};


export class Game {
    private started: boolean;
    private setupValid: boolean;

    private game: GameState[];
    private moves: string[];

    constructor() {
        this.game = [];
        this.moves = [];

        this.started = false;
        this.setupValid = false; 
    }

    getSetupGameState(): GameState | null {
        if(this.game.length === 0) return null;
        return this.game[0];
    }

    getGameState(fullmove: number, color: Color): GameState | null {
        const idx = this.gameStateIdx(fullmove, color);
        return idx < 0? null : this.game[idx];
    }

    loadSetup(s: State) {
        if(this.started) throw Err.New(Err.InvalidOp, "game has started");
        
        const st = this.validStateOf(s);
        const fen = FEN.generate(st);
        const id = ID.generateFromFEN(fen);
        
        const from = Location.None;
        const to = Location.None;
        const count = {[id]: 1};

        this.game = [{...st, fen: fen, id: id, from: from, to: to, count: count}];
        this.setupValid = false;
    }

    validateSetup() {
        if(this.started) throw Err.New(Err.InvalidOp, "game has started");
        if(this.game.length === 0) throw Err.New(Err.NoSetupLoaded, "no setup loaded");

        const setup = this.game[0];
        const clock = setup.clock;

        // Clock: Max halfmove should not be exceeded
        if(clock.halfmove > Clock.MaxHalfmove) throw Err.New(Err.InvalidHalfmove, "invalid halfmove");
        
        // Position:
        // 1. Count king for both sides, each side should have exactly 1 king
        // 2. No pawn in 1st rank of both sides
        // 3. Validate check
        this.setupValidateKingCount(setup.pos);
        this.setupValidatePawnRank(setup.pos);
        this.setupValidateCheck(setup.move, setup.pos);

        this.setupValid = true;
    }

    start() {
        if(!this.setupValid) throw Err.New(Err.InvalidOp, "invalid setup");
        this.started = true;
    }

    private gameStateIdx(fullmove: number, color: Color): number {
        if(this.game.length === 0) return -1;

        const setup = this.game[0];
        if(fullmove < setup.clock.fullmove) return -1;

        let idx: number = 2*(fullmove - setup.clock.fullmove);
        if(color === Black) idx++;
        if(setup.move === Black) idx--;

        return idx;
    }

    private moveIdx(fullmove: number, color: Color): number {
        const idx = this.gameStateIdx(fullmove, color)-1;
        return idx < 0? -1 : idx;
    }

    private validStateOf(s: State): State {
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

    private isValidEnPassantTarget(target: Location.Location, player: Color, pos: Position): boolean {
        const rank = Location.rank(target);
        const file = Location.file(target);
        
        const targetRank = EnPassant.targetRank(player);
        if(rank !== targetRank) return false;
        
        const opponent = opponentOf(player);
        const opponentPawnLoc = EnPassant.opponentPawnLoc(file, player);
        
        const pawns = Filter.New(Piece.getList(), Piece.byType(Piece.TypePawn))();
        const opponentPawn = Filter.New(pawns, Piece.byColor(opponent))()[0].letter;
        
        if(getByLocation(pos, opponentPawnLoc) !== opponentPawn) return false;
        
        const playerPawn = Filter.New(pawns, Piece.byColor(player))()[0].letter;
        const playerPawnsLoc = EnPassant.playerPawnsLoc(file, player);

        for(const loc of playerPawnsLoc) {
            if(getByLocation(pos, loc) === playerPawn) return true;
        }
        
        return false;
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
        const playerKingLoc = this.setupLocateKing(player, pos);
        const opponentKingLoc = this.setupLocateKing(opponent, pos);

        // Validation:
        // 1. Player is not checking opponent king
        const opponentAttackers = GamePos.analyzeAttackOn(pos, opponent, opponentKingLoc);
        if(opponentAttackers.length > 0) throw Err.New(Err.InvalidPosition, `${opponent} king can't be in check`);
        
        // 2. If player is in check, there should be at most 2 attackers
        const attackers = GamePos.analyzeAttackOn(pos, player, playerKingLoc);
        if(attackers.length > 2) throw Err.New(Err.InvalidPosition, "too many checking pieces");
    }

    private setupLocateKing(color: Color, pos: Position): Location.Location {
        const filter = Filter.New(Piece.getList(), Piece.byType(Piece.TypeKing), Piece.byColor(color));
        const king = filter()[0].letter;

        for(let rank = 1; rank <= size; rank++) {
            for(let file = 1; file <= size; file++) {
                const piece = get(pos, rank, file);
                if(piece === king) return Location.of(file, rank);
            }
        }

        return Location.None;
    }
};
