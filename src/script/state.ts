import * as Clock from './clock.js';
import * as Setup from './setup.js';
import * as Castle from './castle.js';
import { White } from './color.js';
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


export function New(): State {
    // {'K': true, 'Q': true, 'k': true, 'q': true}
    const castleDefault = Castle.getList().map(castle => castle.letter)
        .reduce((opt, type) => ({...opt, [type]: true}), {});

    return {
        pos: Setup.defaultSetup(),
        move: White,
        castle: castleDefault,
        enPassant: "",
        clock: Clock.New(),
        id: "",
    }
}
