export function isNumeric(str: string): boolean {
    if(str.length === 0) return false;

    const asciiLow = "0".charCodeAt(0);
    const asciiHigh = "9".charCodeAt(0);

    for(let idx = 0; idx < str.length; idx++) {
        const ascii = str[idx].charCodeAt(0);
        if(ascii < asciiLow || ascii > asciiHigh) return false;
    }
    return true;
}
