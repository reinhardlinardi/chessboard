import * as Castle from './castle.js';
import * as Piece from './piece.js';
import * as Location from './location.js';
import * as EnPassant from './en-passant.js';
import * as Filter from './filter.js';
import * as FEN from './fen.js';
import * as ID from './id.js';
import * as Clock from './clock.js';
import { Direction } from './direction.js';
import { State } from './state.js';
import { Color, White, Black, opponentOf } from './color.js';
import { Position, get, getByLocation } from './position.js';
import { Size as size } from './size.js';
import * as Err from './analysis-error.js';


export interface GameState extends State {
    fen: string,
    id: string,
};

// export interface GameMove {
//     move: Color.Color,
//     pgn: string,
//     from: Location.Location,
//     direction: Direction,
// };


export class Game {
    private started: boolean;
    // private ended: boolean;
    private setupValid: boolean;

    private setup: GameState | null;
    // private game: GameState | null;
    // private moves: GameMove[];


    constructor() {
        this.setup = null;
        // this.game = null;
        // this.moves = [];

        this.started = false;
        // this.ended = false;
        this.setupValid = false; 
    }

    getSetupGameState(): GameState | null {
        return this.setup === null? null : {...this.setup};
    }

    loadSetup(s: State) {
        if(this.started) throw Err.New(Err.InvalidOp, "game has started");
        
        const st = this.validStateOf(s);
        const fen = FEN.generate(st);
        const id = ID.generateFromFEN(fen);

        this.setup = {...st, fen: fen, id: id};
        this.setupValid = false;
    }

    validateSetup() {
        if(this.started) throw Err.New(Err.InvalidOp, "game has started");

        const setup = this.setup!;
        const clock = setup.clock;

        // Clock: Max halfmove should not be exceeded
        if(clock.halfmove > Clock.MaxHalfmove) throw Err.New(Err.InvalidHalfmove, "invalid halfmove");
        
        // Position
        const pos = setup.pos;

        // 1. Count and locate king for both sides, each side should have exactly 1 king
        const king: {[c: Color]: Location.Location} = {};
        king[White] = this.setupLocateKing(pos, White);
        king[Black] = this.setupLocateKing(pos, Black);
        
        // 2. No pawn in 1st or 8th rank
        this.setupCheckPawnRank(pos);

        // 3. Side to move is not checking opponent king
        // 4. If side to play is in check, there should be at most 2 attackers

        this.setupValid = true;
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
            if(!this.isValidEnPassantTarget(st.enPassant, st.move, st.pos)) st.enPassant = none;
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

    private setupLocateKing(pos: Position, color: Color): Location.Location {
        let loc: Location.Location[] = [];

        const type = Piece.TypeKing;
        const filters: Filter.Filter<Piece.Piece>[] = [Piece.byColor(color), Piece.byType(type)];
        const target = Filter.New(Piece.getList(), ...filters)()[0].letter;

        for(let rank = 1; rank <= size; rank++) {
            for(let file = 1; file <= size; file++) {
                const piece = get(pos, rank, file);
                if(piece === target) loc.push(Location.of(file, rank));
            }
        }

        if(loc.length !== 1) throw Err.New(Err.InvalidKingCount, `invalid king count for ${color}`);
        return loc[0];
    }

    private setupCheckPawnRank(pos: Position) {
        const ranks: number[] = [1, size];
        
        const pawns = Filter.New(Piece.getList(), Piece.byType(Piece.TypePawn))();
        const P = Filter.New(pawns, Piece.byColor(White))()[0].letter;
        const p = Filter.New(pawns, Piece.byColor(Black))()[0].letter;

        for(const rank of ranks) {
            for(let file = 1; file <= size; file++) {
                const piece = get(pos, rank, file);
                if(piece === P || piece === p) throw Err.New(Err.InvalidPawnRank, `no pawns allowed in rank ${rank}`);
            }
        }
    }

    // private moveIdx(fullmove: number): number {
    //     const s = this.setup!;

    //     let idx: number = 2*(fullmove - s.clock.fullmove);
    //     return s.move === White? idx: Math.max(0, idx-1);
    // }
};
