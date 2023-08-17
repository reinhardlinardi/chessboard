import * as Castle from './castle.js';
import * as Piece from './piece.js';
import * as Location from './location.js';
import * as EnPassant from './en-passant.js';
import * as Filter from './filter.js';
import * as FEN from './fen.js';
import * as ID from './id.js';
import * as Clock from './clock.js';
import * as Color from './color.js';
import { Direction } from './direction.js';
import { State } from './state.js';
import { Position, getByLocation } from './position.js';
import * as Err from './analysis-error.js';


const numColor = Color.getList().length;


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

    loadState(s: State) {
        if(this.started) throw Err.New(Err.InvalidOp, "game has started");
        
        const st = this.validStateOf(s);
        const fen = FEN.generate(st);
        const id = ID.generateFromFEN(fen);

        this.setup = {...st, fen: fen, id: id};
        this.setupValid = false;
    }

    getSetupGameState(): GameState | null {
        if(this.setup === null) return null;
        else return {...this.setup};
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

    private isValidEnPassantTarget(target: Location.Location, player: Color.Color, pos: Position): boolean {
        const rank = Location.rank(target);
        const file = Location.file(target);
        
        const targetRank = EnPassant.targetRank(player);
        if(rank !== targetRank) return false;
        
        const opponent = Color.opponentOf(player);
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

    private validateState(s: State) {
        // Clock
        // Check max halfmove

        // Position
        // 1. Count and locate both kings, each side should have exactly 1 king
        // 2. No pawn in 1st and 8th rank
        // 3. Side to move is not checking opponent king
        // 4. If side to play is in check, there should be at most 2 attackers

        this.setupValid = true;
    }

    // private moveIdx(fullmove: number): number {
    //     if(this.initial === null) return -1;
    //     const s = this.initial;

    //     let idx: number = numColor*(fullmove - s.clock.fullmove);
    //     return s.move === Color.White? idx: Math.max(0, idx-1);
    // }
};
