import * as Piece from '../../public/module/piece.js';
import * as Position from '../../public/module/position.js';

test("copy position", () => {
    const K = Piece.WhiteKing;
    const _ = Piece.None;

    const pos = [
        [K, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _],
    ];

    const copy = Position.copy(pos);
    copy[0][0] = _;

    expect(pos[0][0]).toBe(K);
});