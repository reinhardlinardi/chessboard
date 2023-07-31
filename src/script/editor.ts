import * as Setup from './setup.js';
import * as Piece from './piece.js';
import { copyPosition } from './util.js';

export class Editor {
    private position: string[][];

    public constructor() {
        this.position = [];
    }

    public getPosition(): string[][] {
        return copyPosition(this.position);
    }

    public setDefaultSetup() {
        this.position = Setup.getDefaultSetup();
    }

    public clear() {
        this.position = Array(8).fill(
            Array(8).fill(Piece.None)
        )
    }
}