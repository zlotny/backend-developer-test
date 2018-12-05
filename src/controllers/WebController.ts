import { Config } from "config/Configuration";
import Axios from "axios";
import User from "models/User";

const UserModel: any = new User().getModelForClass(User);

export default class WebController {
    public static async landing(req, res) {
        res.render('home');
    }
}