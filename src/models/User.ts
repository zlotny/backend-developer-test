import { prop, Typegoose, arrayProp, Ref, index } from 'typegoose';
import Game from './Game';

@index({ location: '2d' })
export default class User extends Typegoose {
    @prop({ required: true, unique: true })
    email: string;

    @prop()
    token: string;

    @prop()
    isAdmin: boolean;

    @prop({ required: true })
    name: string;

    @prop({ required: true })
    location: number[];

    @arrayProp({ itemsRef: Game })
    games: Ref<Game>[];

    @prop({ default: null })
    age: number;

    @prop({ default: false })
    availableAsHost: boolean;
}