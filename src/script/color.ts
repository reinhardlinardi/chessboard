export const White: string = "w";
export const Black: string = "b";

export function opposite(color: string): string {
    return color === White? Black : White;
}
