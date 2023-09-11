import * as Score from './game-score.js';
import * as Conclusion from './game-conclusion.js';
import { Color, White } from './color.js';


export interface Result {
    ended: boolean,
    score: Score.Score,
    conclusion: Conclusion.Conclusion,
}


export function playInProgress(): Result {
    return {ended: false, score: Score.None, conclusion: Conclusion.None};
}

export function checkmated(player: Color) {
    const score = Score.get(player, false);
    const conclusion = player === White? Conclusion.BlackCheckmate : Conclusion.WhiteCheckmate;

    return {ended: true, score: score, conclusion: conclusion};
}

export function draw(conclusion: Conclusion.Conclusion) {
    return {ended: true, score: Score.Draw, conclusion: conclusion};
}

export function isResultCheckmate(result: Result): boolean {
    const c = result.conclusion;
    return result.ended && Conclusion.isConclusionCheckmate(c);
}
