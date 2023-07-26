export function splitRow(row: string[]): string[][] {
    let squares: string[][] = new Array(8);
    for(let i = 0; i < 8; i++) {
        squares[i] = [row[i]]; 
    }
    return squares;
}

export function mergeRow(squares: string[][]): string[] {
    let row: string[] = new Array(8);
    for(let i = 0; i < 8; i++) {
        row[i] = squares[i][0];
    }
    return row;
}

export function copyBoard(setup: string[][]): string[][] {
    let copy: string[][] = new Array(8);
    
    for(let rank = 0; rank < 8; rank++) {
        copy[rank] = new Array(8);
        for(let file = 0; file < 8; file++) {
            copy[rank][file] = setup[rank][file];
        }
    }
    
    return copy
}