import * as Piece from './piece.js';
import * as File from './file.js';
import * as Loc from './location.js';
import { State } from './state.js';
import { Size as size } from './size.js';
import { Clock } from './clock.js';
import { isNumeric } from './string-util.js';
import { getList as getColors } from './color.js';
import { Position, New, get, setRow } from './position.js';
import { getList as pieceList } from './piece-list.js';
import { getList as castleList, getRights as getCastleRights } from './castle-list.js';
import * as Err from './fen-error.js';


export const NA = "-"; // not available
export const RowDelimiter = "/";


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
    const placement: string = rows.join(RowDelimiter); 

    // Castle rights, e.g. "KQkq"
    let castle: string = Object.keys(s.castle).filter(type => s.castle[type]).join("");
    if(castle === "") castle = NA;

    // En passant
    let enPassant: string = NA;
    if(s.enPassant !== Loc.None) {
        const file = File.labelOf(Loc.file(s.enPassant));
        const rank = Loc.rank(s.enPassant);
        enPassant = `${file}${rank}`;
    }
    
    // Clocks
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
    if(parts.length != length) throw Err.New(Err.InvalidNumFields, "invalid num of fields");

    // 2. Validate syntax
    for(let idx = 0; idx < length; idx++) {
        if(parts[idx].match(regex[idx]) === null) {
            throw Err.New(Err.InvalidSyntax, `invalid syntax for field ${idx+1}`);
        }
    }

    // 3. Load
    const pos = loadPosition(parts[0]);
    const move = parts[1];
    const rights = parts[2];

    let castle = getCastleRights(false);
    if(rights !== NA) {
        for(const type of rights) castle[type] = true;
    }

    let enPassant = Loc.None;
    const target = parts[3];

    if(target !== NA) {
        const file = File.of(target[0]);
        const rank = parseInt(target[1]);
        enPassant = Loc.of(file, rank);
    }
    
    const clock: Clock = {halfmove: parseInt(parts[4]), fullmove: parseInt(parts[5])};
    
    const state = {pos: pos, move: move, castle: castle, enPassant: enPassant, clock: clock};
    return state;
}

function loadPosition(str: string): Position {
    let pos: Position = New();
    const rows = str.split(RowDelimiter);
    
    for(let rank = size; rank >= 1; rank--) {
        const row = rows[size-rank];
        let cnt: number = 0;
        let squares: string = "";

        for(let idx = 0; idx < row.length; idx++) {
            let square = row[idx];
            let repeat = 1;

            if(isNumeric(row[idx])) {
                square = Piece.None;
                repeat = parseInt(row[idx]);
            }
            cnt += repeat;
            squares += square.repeat(repeat);
        }
        
        // Number of empty + occupied squares in rank must be equal to 8
        if(cnt !== size) throw Err.New(Err.InvalidSquareCount, `invalid num of squares for rank ${rank}`);
        else setRow(squares.split(""), pos, rank);
    }

    return pos;
}


const regex: readonly string[] = Object.freeze(regexPatterns());

function regexPatterns(): string[] {
    const num = [...Array(size).keys()].map(n => (n+1).toString()).join("");
    
    const pieces = pieceList().map(piece => piece.letter).join("");
    const squareRegex = `[${pieces}${num}]{1,${size}}`; // [PNBRQKpnbrqk12345678]{1,8}
    
    // ^[PNBRQKpnbrqk12345678]{1,8}(?:/[PNBRQKpnbrqk12345678]{1,8}){7}$
    const placementRegex = `^${squareRegex}(?:${RowDelimiter}${squareRegex}){${size-1}}$`;

    const colors = getColors();
    const moveRegex = `^[${colors}]$`; // ^[w,b]$

    const castles = castleList().map(castle => castle.letter).join("");
    const castleRegex = `^${NA}|[${castles}]{1,${castles.length}}$`; // ^-|[KQkq]{1,4}$

    const files = File.getLabels().join("");
    const enPassantRegex = `^${NA}|[${files}][${num}]$`; // ^-|[abcdefgh][12345678]$

    const clockRegex = `^\\d+$`; // ^\d+$

    return [placementRegex, moveRegex, castleRegex, enPassantRegex, clockRegex, clockRegex];
}
