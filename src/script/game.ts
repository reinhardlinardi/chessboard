import * as Castle from './castle.js';
import * as Piece from './piece.js';
import * as Location from './location.js';
import * as EnPassant from './en-passant.js';
import * as Filter from './filter.js';
import { State, New } from './state.js';
import { Color, opponentOf } from './color.js';
import { Position, getByLocation } from './position.js';
import { Clock, FullmoveStart, HalfmoveStart, MaxHalfmove }  from './clock.js';
import * as Err from './game-error.js';


export class Game {
    private state: State;
    private start: boolean;
    private end: boolean;

    constructor() {
        this.state = New();
        this.start = false;
        this.end = false;
    }

    /* Import game */

    fromState(s: State): State {
        if(this.start || this.end) throw Err.New(Err.InvalidOp, "game has started or ended");
        
        let st = {...s};
        st.clock = this.validClock(st.clock);
        st.castle = this.validCastleRights(st.castle, st.pos);
        st.enPassant = this.validEnPassant(st.enPassant, st.move, st.pos);

        this.state = st;
        return st;
    }

    private validClock(c: Clock): Clock {
        return {
            halfmove: (c.halfmove > MaxHalfmove)? HalfmoveStart : c.halfmove,
            fullmove: (c.fullmove === 0)? FullmoveStart : c.fullmove,
        }
    }
    
    private validCastleRights(castle: Castle.Rights, pos: Position): Castle.Rights {
        let valid = {...castle};

        for(const type in valid) {
            const c = Castle.get(type);
            const king = c.king;
            const rook = c.rook;

            valid[type] = getByLocation(pos, king.from) === king.piece &&
                getByLocation(pos, rook.from) === rook.piece;
        }
        return valid;
    }

    private validEnPassant(loc: Location.Location, player: Color, pos: Position): Location.Location {
        const rank = Location.rank(loc);
        const file = Location.file(loc);
        
        const targetRank = EnPassant.targetRank(player);
        if(rank !== targetRank) return Location.None;
        
        const opponent = opponentOf(player);
        const opponentPawnLoc = EnPassant.opponentPawn(file, player);
        
        const pawns = Filter.New(Piece.getList(), Piece.byType(Piece.TypePawn))();
        const playerPawn = Filter.New(pawns, Piece.byColor(player))()[0].letter;
        const opponentPawn = Filter.New(pawns, Piece.byColor(opponent))()[0].letter;
        
        if(getByLocation(pos, opponentPawnLoc) !== opponentPawn) return Location.None;
        
        const playerPawnLoc = EnPassant.playerPawn(file, player);
        for(const l of playerPawnLoc) {
            if(getByLocation(pos, l) === playerPawn) return loc;
        }
        
        return Location.None;
    }

    // private validatePosition(s: State) {
    //     // 1. Count and locate both kings, each side should have exactly 1 king
    //     // 2. No pawn in 1st and 8th rank
    //     // 3. Side to move is not checking opponent king
    //     // 4. If side to play is in check, there should be at most 2 attackers
    // }
};
