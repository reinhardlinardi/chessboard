import * as Clock from './clock.js';
import * as Setup from './setup.js';
import * as Castle from './castle.js';
import * as Loc from './location.js';
import * as Castles from './castles.js';
import { Color, White } from './color.js';
import { Position } from './position.js';


export interface State {
    pos: Position,
    move: Color,
    castle: Castle.Rights,
    enPassant: Loc.Location,
    clock: Clock.Clock,
};


export function New(): State {
    return {
        pos: Setup.defaultSetup(),
        move: White,
        castle: Castles.getRights(true),
        enPassant: Loc.None,
        clock: Clock.New(),
    }
}
