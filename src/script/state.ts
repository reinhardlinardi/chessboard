import * as Clock from './clock.js';
import * as Setup from './setup.js';
import * as Castle from './castle.js';
import * as Location from './location.js';
import { Color, White } from './color.js';
import { Position } from './position.js';


// Game state
export interface State {
    pos: Position,
    move: Color,
    castle: Castle.Rights,
    enPassant: Location.Location,
    clock: Clock.Clock,
    id: string,
};


export function New(): State {
    return {
        pos: Setup.defaultSetup(),
        move: White,
        castle: Castle.getRights(true),
        enPassant: Location.None,
        clock: Clock.New(),
        id: "",
    }
}
