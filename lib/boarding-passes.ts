export function parseBoardingPass(pass: string) {
    if (pass.length !== 10) throw new Error(`Invalid boarding pass: ${pass}`);
    // interpret each of the parts as a binary number with B/R being 1 and F/L being 0
    const row = parseInt(pass.substr(0, 7).replace(/F/g, '0').replace(/B/g, '1'), 2);
    const col = parseInt(pass.substr(7, 3).replace(/L/g, '0').replace(/R/g, '1'), 2);
    return {
        row,
        col,
        seat: row * 8 + col,
    };
}
