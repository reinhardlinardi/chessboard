export interface Square {
    rank: number,
    file: number,
};


const label: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"];
const map: {[key: string]: number} = label.reduce((res, val, idx) => ({...res, [val]: idx}), {});

export function labelOf(file: number): string {
    return label[file-1];
};

export function fileOf(label: string): number {
    return map[label]+1;
};
