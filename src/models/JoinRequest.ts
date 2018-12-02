import { prop, Typegoose, instanceMethod } from 'typegoose';
import User from './User';
import Game from './Game';
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