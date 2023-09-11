import * as Loc from './location.js';
import * as Type from './piece-type.js';
import * as Attacks from './attack.js';
import * as Pieces from './pieces.js';
import * as Castles from './castles.js';
import * as File from './file.js';
import * as game from './game-util.js';
import { Position, getByLoc } from './position.js';
import { Color, opponentOf } from './color.js';
import { Result, isResultCheckmate } from './game-result.js';


export const None = "...";


type Location = Loc.Location;

const figurine = Object.freeze({
    [Type.TypeKnight]: "♘",
    [Type.TypeBishop]: "♗",
    [Type.TypeRook]: "♖",
    [Type.TypeQueen]: "♕",
    [Type.TypeKing]: "♔",
});


export function of(from: Location, to: Location, promoted: Type.Type, player: Color, pos: Position, updated: Position, result: Result): string {
    let parts: string[] = [];
    const isCastle = game.isCastleMove(pos, from, to, player);

    if(isCastle) parts.push(Castles.getByKingLoc(to).type);
    else {
        const isPawnMove = game.isPawnMove(pos, from);
        const isCaptureMove = game.isCaptureMove(pos, to);
        const isPromotion = game.isPromotion(pos, player, from, to);

        const type = Pieces.get(getByLoc(pos, from)).type;
        
        const figure = isPawnMove? "" : figurine[type];
        const fromSquare = getSquareId(from, to, pos, player);
        const capture = isCaptureMove? "x" : "";

        const dest = File.labelOf(Loc.file(to)) + Loc.rank(to).toString();
        const idx = isPawnMove && !isCaptureMove? 1 : 0;
        
        const toSquare = dest.substring(idx);
        const promoteTo = isPromotion? `=${Pieces.getBy(player, promoted).letter}` : "";

        parts.push(figure, fromSquare, capture, toSquare, promoteTo);
    }

    const opponent = opponentOf(player);
    const opponentAttacks = Attacks.attacksOn(opponent, updated);
    
    const inCheck = Attacks.isKingAttacked(opponent, updated, opponentAttacks);
    const isCheckmate = isResultCheckmate(result);

    parts.push(isCheckmate? "#" : inCheck? "+" : "");
    return parts.join("");
}


function getSquareId(from: Location, to: Location, pos: Position, player: Color): string {
    const file = Loc.file(from);
    const rank = Loc.rank(from);
    const label = File.labelOf(file);

    const isPawnMove = game.isPawnMove(pos, from);
    if(isPawnMove) return label;
    
    const opponent = opponentOf(player);
    const search = getByLoc(pos, from);
    
    let attackers = Object.keys(Attacks.attacksOn(opponent, pos)[to]).map(loc => parseInt(loc));
    attackers = attackers.filter(loc => loc !== from && getByLoc(pos, loc) === search);

    if(attackers.length === 0) return "";

    const onFile = attackers.filter(loc => Loc.file(loc) === file);
    const onRank = attackers.filter(loc => Loc.rank(loc) === rank);

    if(onFile.length === 0) return label;
    if(onRank.length === 0) return rank.toString();
    return label + rank.toString();
}
