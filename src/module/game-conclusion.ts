export type Conclusion = number;

export const None: Conclusion = 0;
export const WhiteCheckmate: Conclusion = 1;
export const BlackCheckmate: Conclusion = -1;
export const Insufficient: Conclusion = -2;
export const Stalemate: Conclusion = 2;
export const Repetition: Conclusion = 3;
export const FiftyMove: Conclusion = 50;


export function isConclusionCheckmate(c: Conclusion): boolean {
    return c === WhiteCheckmate || c === BlackCheckmate;
}
