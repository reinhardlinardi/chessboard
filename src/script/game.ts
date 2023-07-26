import * as Position from './position.js';

// 0-based rank, 0-based file chess backend
export class Game {
    private position: string[];
    private started: boolean;

    public constructor() {
        this.position = Position.copy(Position.Empty);
        this.started = false;
    }

    public getPosition(): string[] {
        return Position.copy(this.position);
    }

    public setDefaultPosition() {
        if(this.started) return;
        this.position = Position.copy(Position.Default);
    }
}