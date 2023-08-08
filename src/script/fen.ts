import * as Piece from './piece.js';
import * as Color from './color.js';
import * as Castle from './castle.js';
import * as File from './file.js';
import { State } from './state.js';
import { get } from './position.js';
import { Size as size } from './size.js';
import { HalfmoveStart, FullmoveStart, MaxHalfmove } from './clock.js';
import * as Err from './fen-error.js';


export function generate(s: State): string {
    let rows: string[] = new Array(size);
    
    for(let rank = size; rank >= 1; rank--) {
        let row: string = "";
        let cnt: number = 0;

        for(let file = 1; file <= size; file++) {
            const piece = get(s.pos, rank, file);
            
            if(piece === Piece.None) cnt++;
            if(cnt > 0 && (piece !== Piece.None || file === size)) {
                row += `${cnt}`;
                cnt = 0;
            }
            if(piece !== Piece.None) row += piece;
        }

        rows[size-rank] = row;
    }

    // Piece placement, e.g. "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
    const placement: string = rows.join("/"); 

    // Available castle types, e.g. "KQkq"
    let castle: string = Object.keys(s.castle).filter(type => s.castle[type]).join("");
    if(castle === "") castle = "-";

    const enPassant: string = (s.enPassant === "")? "-" : s.enPassant;
    const halfmove = s.clock.halfmove.toString();
    const fullmove = s.clock.fullmove.toString();
    
    const parts: string[] = [placement, s.move, castle, enPassant, halfmove, fullmove];
    return parts.join(" ");
}

export function load(str: string): State {
    // Parse
    const length = 6;

    // 1. Trim and split string into parts
    let parts = str.trim().split(/\s+/);
    if(parts.length != length) throw Err.New(Err.InvalidFmt, "invalid format");

    // 2. Validate syntax with regex
    for(let idx = 0; idx < length; idx++) {
        if(parts[idx].match(regex[idx]) === null) {
            throw Err.New(Err.RegexNotMatch, `regex ${idx} not match`);
        }
    }

    // 3. Validate semantic and overwrite invalid values
    let move = parts[1];

    // 3.1 Overwrite clock values
    let halfmove: number = parseInt(parts[4]);
    if(halfmove > MaxHalfmove) halfmove = HalfmoveStart;

    let fullmove: number = parseInt(parts[5]);
    if(fullmove < FullmoveStart) fullmove = FullmoveStart;

    // 3.2 Validate row size and row square count
    
    // let pos: Position;
    // let castle: {[c: string]: boolean};

    // let move, enPassant: string;
    


    // pos = [];
    // castle = {};

    // enPassant = parts[3];

    

    // // 4. Validate position

    // // 4.1. Count and locate both kings, each side should have exactly 1 king
    // // 4.2. No pawn in 1st and 8th rank
    // // 4.3. Side to move is not checking opponent king
    // // 4.4. If side to play is in check, there should be at most 2 attackers

    // Load
    const state = {
        pos: [],
        move: move,
        castle: {},
        enPassant: "",
        clock: {
            halfmove: halfmove,
            fullmove: fullmove,
        },
        id: "",
    };

    return state;
}


export const regex = regexPattern();

function regexPattern(): string[] {
    const num = [...Array(size).keys()].map(n => (n+1).toString()).join("");
    
    const pieces = Piece.getList().map(piece => piece.letter).join("");
    const squareRegex = `[${pieces}${num}]{1,${size}}`; // [PNBRQKpnbrqk12345678]{1,8}
    const placementRegex = `^${squareRegex}(?:/${squareRegex}){${size-1}}$`; // ^[PNBRQKpnbrqk12345678]{1,8}(?:/[PNBRQKpnbrqk12345678]{1,8}){7}$

    const colors = Color.getList();
    const moveRegex = `^[${colors}]$`; // ^[w,b]$

    const castles = Castle.getList().map(castle => castle.letter).join("");
    const castleRegex = `^-|[${castles}]{1,${castles.length}}$`; // ^-|[KQkq]{1,4}$

    const files = File.getLabels().join("");
    const enPassantRegex = `^-|[${files}][${num}]$`; // ^-|[abcdefgh][12345678]$

    const clockRegex = `^\\d+$`;

    return [placementRegex, moveRegex, castleRegex, enPassantRegex, clockRegex, clockRegex];
}
