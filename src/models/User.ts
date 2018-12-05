import GeoCoordinates from './GeoCoordinates';
import { prop, Typegoose, arrayProp, Ref } from 'typegoose';
import Game from './Game';

export default class User extends Typegoose {
    @prop({ required: true, unique: true })
    email: string;

    @prop()
    token: string;

    @prop({ required: true })
    name: string;

    @prop({ required: true, default: new GeoCoordinates() })
    location: GeoCoordinates;

    @arrayProp({ itemsRef: Game })
    games: Ref<Game>[];

    @prop({ default: null })
    age: number;

    @prop({ default: false })
    availableAsHost: boolean;
}