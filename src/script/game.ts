import * as Piece from './piece.js';
import * as Setup from './setup.js';
import * as util from './util.js';

// 0-based rank, 0-based file chess backend
export default class Game {
    private position: string[][];
    private started: boolean;

    public constructor() {
        this.position = util.copyBoard(Setup.Empty);
        this.started = false;
    }

    public getPosition(): string[][] {
        let copy = util.copyBoard(this.position);
        return copy;
    }

    public setDefaultPosition() {
        if(this.started) return;
        this.position = util.copyBoard(Setup.Default);
    }
}