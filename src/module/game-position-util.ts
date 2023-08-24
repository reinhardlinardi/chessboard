import * as Piece from './piece.js';
import * as Filter from './filter.js';
import * as Location from './location.js';
import { Color } from './color.js';
import { Size as size } from './size.js';
import { Position, get } from './position.js';


export function outOfBound(loc: Location.Location): boolean {
    const file = Location.file(loc);
    const rank = Location.rank(loc);

    return file < 1 || file > size || rank < 1 || rank > size;
}

export function getKingLocation(pos: Position, color: Color): Location.Location {
    const pieces = Piece.getList();
    const king = Filter.New(pieces, Piece.byType(Piece.TypeKing), Piece.byColor(color))()[0].letter;

    for(let rank = 1; rank <= size; rank++) {
        for(let file = 1; file <= size; file++) {
            const piece = get(pos, rank, file);
            if(piece === king) return Location.of(file, rank);
        }
    }

    return Location.None;
}
