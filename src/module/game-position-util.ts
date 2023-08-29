import * as Piece from './piece.js';
import * as Filter from './filter.js';
import * as Loc from './location.js';
import { Color } from './color.js';
import { Size as size } from './size.js';
import { Position, get } from './position.js';
import { TypeKing } from './piece-type.js';


export function outOfBound(loc: Loc.Location): boolean {
    const file = Loc.file(loc);
    const rank = Loc.rank(loc);

    return file < 1 || file > size || rank < 1 || rank > size;
}

export function getKingLocation(pos: Position, color: Color): Loc.Location {
    const pieces = Piece.getList();
    const king = Filter.New(pieces, Piece.byType(TypeKing), Piece.byColor(color))()[0].letter;

    for(let rank = 1; rank <= size; rank++) {
        for(let file = 1; file <= size; file++) {
            const piece = get(pos, rank, file);
            if(piece === king) return Loc.of(file, rank);
        }
    }

    return Loc.None;
}
