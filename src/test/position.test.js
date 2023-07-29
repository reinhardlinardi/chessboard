import * as Position from '../../public/module/position.js';

test('copy position', () => {
    const K = "K";
    const _ = ".";

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