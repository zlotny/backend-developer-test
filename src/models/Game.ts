import { prop, Typegoose } from 'typegoose';

export default class Game extends Typegoose {
    @prop({ required: true, unique: true })
    title: string;

    @prop()
    description: string;

    @prop()
    minPlayers: string;

    @prop()
    maxPlayers: string;
}