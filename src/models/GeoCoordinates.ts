import { prop, Typegoose } from 'typegoose';

export default class GeoCoordinates {
    @prop()
    latitude: number;

    @prop()
    longitude: number;
}