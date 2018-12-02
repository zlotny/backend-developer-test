import { prop, Typegoose, arrayProp, instanceMethod } from "typegoose";
import Game from "./Game";
import User from "./User";

export default class GameMatch extends Typegoose {
    @prop()
    game: Game;

    @prop()
    host: User;

    @arrayProp({ items: User })
    players: User[];
}