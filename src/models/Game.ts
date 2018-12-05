import { prop, Typegoose } from 'typegoose';

export default class Game extends Typegoose {
    @prop({ required: true, unique: true })
    title: string;

    @prop({ required: true })
    description: string;

    @prop({ required: true })
    minPlayers: number;

    @prop({ required: true })
    maxPlayers: number;
}