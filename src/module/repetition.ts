import { StateCount } from "./game-data.js";


const Threefold = 3;

export function isThreefold(count: StateCount): boolean {
    for(const state in count) {
        if(count[state] === Threefold) return true;
    }
    return false;
}
