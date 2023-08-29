import murmur3_32 from '../lib/murmur3-32.min.js';


// Generate state unique id in the form of hex string from FEN
export function generateFromFEN(fen: string): string {
    // Exclude clock parts from FEN string
    const parts = fen.split(" ");
    const pos = [parts[0], parts[1], parts[2], parts[3]].join(" ");
    
    // Hash and return as hex string
    return murmur3_32(pos, 0).toString(16);
}
