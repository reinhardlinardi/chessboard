export type Color = string;

export const White: Color = "w";
export const Black: Color = "b";

export function opponentOf(color: Color): Color {
    return color === White? Black : White;
}


const list: readonly Color[] = Object.freeze([White, Black]);

export function getList(): Color[] {
    return [...list];
}
