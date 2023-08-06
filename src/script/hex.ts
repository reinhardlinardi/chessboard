import murmur3_32 from '../lib/murmur3-32.min.js';

// Generate position unique id as hex string
export function from(fen: string): string {
    // Get FEN without clock
    const part = fen.split(" ");
    const pos = [part[0], part[1], part[2], part[3]].join(" ");
    
    // Return position hex string
    return murmur3_32(pos, 0).toString(16);
}
