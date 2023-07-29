import * as Setup from './setup.js';
import * as Position from './position.js';

// 0-based rank, 0-based file chess game
export class Game {
    private position: string[][];

    // private started: boolean;
    // private ended: boolean;


    public constructor() {
        this.position = Setup.getDefaultSetup();
        // this.started = false;
        // this.ended = false;
    }

    // public getPosition(): string[][] {
    //     return Position.copy(this.position);
    // }

    // TODO: When attempting to start game, validate position first
}