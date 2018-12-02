import { prop, Typegoose, instanceMethod } from 'typegoose';
import User from './User';
import GameMatch from './GameMatch';

export default class JoinRequest extends Typegoose {
    @prop()
    source: User;

    @prop()
    destination: User;

    @prop()
    match: GameMatch;

    @prop({ default: false })
    resolved: boolean;
}