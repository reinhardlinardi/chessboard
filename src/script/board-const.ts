export const enum Letter {
    WhiteKing = "K",
    WhiteQueen = "Q",
    WhiteRook = "R",
    WhiteBishop = "B",
    WhiteKnight = "N",
    WhitePawn = "P",
    
    BlackKing = "k",
    BlackQueen = "q",
    BlackRook = "r",
    BlackBishop = "b",
    BlackKnight = "n",
    BlackPawn = "p",

    None = ""
};

export const Setup: string[] = [
    [Letter.WhiteRook, Letter.WhiteKnight, Letter.WhiteBishop, Letter.WhiteQueen, Letter.WhiteKing, Letter.WhiteBishop, Letter.WhiteKnight, Letter.WhiteRook].join(""),
    Letter.WhitePawn.repeat(8),
    Letter.None.repeat(8),
    Letter.None.repeat(8),
    Letter.None.repeat(8),
    Letter.None.repeat(8),
    Letter.BlackPawn.repeat(8),
    [Letter.BlackRook, Letter.BlackKnight, Letter.BlackBishop, Letter.BlackQueen, Letter.BlackKing, Letter.BlackBishop, Letter.BlackKnight, Letter.BlackRook].join(""),
];