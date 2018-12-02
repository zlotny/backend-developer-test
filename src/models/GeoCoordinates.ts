import { prop, Typegoose } from 'typegoose';

export default class GeoCoordinates {
    @prop({ default: 0.00 })
    latitude: number;

    @prop({ default: 0.00 })
    longitude: number;
}