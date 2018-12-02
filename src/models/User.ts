import GeoCoordinates from './GeoCoordinates';
import { prop, Typegoose } from 'typegoose';
import Game from './Game';

export default class User extends Typegoose {
    @prop({ required: true, unique: true })
    name: string;

    @prop()
    location: GeoCoordinates;

    @prop()
    games: Game[];

    @prop()
    age: number;

    @prop()
    availableAsHost: boolean;
}