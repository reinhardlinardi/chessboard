import * as Clock from './clock.js';
import * as Setup from './setup.js';
import * as Color from './color.js';
import * as Castle from './castle.js';
import { Position } from './position.js';


// Game state
export interface State {
    pos: Position,
    move: string,
    castle: {[type: string]: boolean},
    enPassant: string,
    clock: Clock.Clock,
    id: string,
};


const w = Color.White;
const b = Color.Black;

export function New(): State {
    const castleDefault = [...Castle.getByColor(w), ...Castle.getByColor(b)]
        .map(castle => castle.letter)
        .reduce((opt, type) => ({...opt, [type]: false}), {});

    return {
        pos: Setup.defaultSetup(),
        move: w,
        castle: castleDefault, // {'K': false, 'Q': false, 'k': false, 'q': false}
        enPassant: "",
        clock: Clock.New(),
        id: "",
    }
}
