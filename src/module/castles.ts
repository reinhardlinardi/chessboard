import * as Castle from './castle.js';
import { Color } from './color.js';
import { Filter, filter } from './filter.js';


const K = Castle.WhiteShort;
const Q = Castle.WhiteLong;
const k = Castle.BlackShort;
const q = Castle.BlackLong;


const list: readonly Castle.Castle[] = Object.freeze([K, Q, k, q]);

export function getList(): Castle.Castle[] {
    return [...list];
}

// {"K": val, "Q": val, "k": val, "q": val}
export function getRights(val: boolean): Castle.Rights {
    return getList().map(castle => castle.letter).reduce((map, type) => ({...map, [type]: val}), {});
}


// {"K": WhiteShort, "Q": WhiteLong, "k": BlackShort, "q": BlackLong}
const map: {[letter: string]: Castle.Castle} = Object.freeze(
    list.reduce((map, castle) => ({...map, [castle.letter]: castle}), {})
);

export function get(letter: string): Castle.Castle {
    return map[letter];
}


export function byColor(color: Color): Filter<Castle.Castle> {
    return castle => castle.color === color;
}


export function getByColor(color: Color): Castle.Castle[] {
    return filter(getList(), byColor(color));
}
