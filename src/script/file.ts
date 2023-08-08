export const a: string = "a";
export const b: string = "b";
export const c: string = "c";
export const d: string = "d";
export const e: string = "e";
export const f: string = "f";
export const g: string = "g";
export const h: string = "h";


const label: readonly string[] = Object.freeze([a, b, c, d, e, f, g, h]);

// {"a": 1, "b": 2, ...}
const map: {[file: string]: number} = Object.freeze(
    label.reduce((map, label, idx) => ({...map, [label]: idx+1}), {})
);


export function labelOf(file: number): string {
    return label[file-1];
}

export function fileOf(label: string): number {
    return map[label];
}
