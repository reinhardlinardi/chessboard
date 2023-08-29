export const a: number = 1;
export const b: number = 2;
export const c: number = 3;
export const d: number = 4;
export const e: number = 5;
export const f: number = 6;
export const g: number = 7;
export const h: number = 8;


const label: readonly string[] = Object.freeze(["a", "b", "c", "d", "e", "f", "g", "h"]);

export function getLabels(): string[] {
    return [...label];
}

export function labelOf(file: number): string {
    return label[file-1];
}


// {"a": 1, "b": 2, ...}
const map: {[file: string]: number} = Object.freeze(
    label.reduce((map, label, idx) => ({...map, [label]: idx+1}), {})
);

export function of(label: string): number {
    return map[label];
}
