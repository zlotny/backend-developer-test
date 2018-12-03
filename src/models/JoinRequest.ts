import { prop, Typegoose, instanceMethod } from 'typegoose';
import User from './User';
import GameMatch from './GameMatch';

export default class JoinRequest extends Typegoose {
    @prop({ required: true })
    source: User;

    @prop({ required: true })
    destination: User;

    @prop({ required: true })
    match: GameMatch;

    @prop({ default: false })
    resolved: boolean;
}