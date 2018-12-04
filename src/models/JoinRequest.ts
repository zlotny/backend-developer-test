import { prop, Typegoose, instanceMethod, Ref } from 'typegoose';
import User from './User';
import GameMatch from './GameMatch';

export default class JoinRequest extends Typegoose {
    @prop({ required: true, ref: User })
    source: Ref<User>;

    @prop({ required: true, ref: User })
    destination: Ref<User>;

    @prop({ required: true, ref: GameMatch })
    match: Ref<GameMatch>;

    @prop({ default: false })
    resolved: boolean;
}