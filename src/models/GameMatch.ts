import { prop, Typegoose, arrayProp, Ref } from "typegoose";
import Game from "./Game";
import User from "./User";

export default class GameMatch extends Typegoose {
    @prop({ required: true, ref: Game })
    game: Ref<Game>;

    @prop({ required: true, ref: User })
    host: Ref<User>;

    @arrayProp({ itemsRef: User })
    players: Ref<User>[];
}