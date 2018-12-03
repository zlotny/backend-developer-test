import { prop, Typegoose, arrayProp } from "typegoose";
import Game from "./Game";
import User from "./User";

export default class GameMatch extends Typegoose {
    @prop({ required: true })
    game: Game;

    @prop({ required: true })
    host: User;

    @arrayProp({ items: User })
    players: User[];
}