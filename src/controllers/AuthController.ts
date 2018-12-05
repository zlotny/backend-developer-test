import { Config } from "config/Configuration";
import Axios from "axios";
import User from "models/User";

const UserModel: any = new User().getModelForClass(User);

export default class AuthController {
    public static async googleAuthCallback(req, res) {
        let profileData = await Axios.get(
            Config.googleUserInfoUrl,
            { headers: { 'Authorization': "Bearer " + req.query.access_token } }
        );

        let user_email: string = req.query.id_token.payload.email;
        let user_token: string = req.query.raw.id_token;
        let userName: string = profileData.data.name;

        let user: typeof UserModel = await UserModel.findOne({ email: user_email });

        if (user === null) {
            user = new UserModel({
                email: user_email,
                token: user_token,
                name: userName,
                isAdmin: false,
                location: req.location
            });
            await user.save();
        } else {
            user.token = user_token;
            user.location = req.location;
            await user.save();
        }
        res.end(JSON.stringify(user_token));
    }

    public static async facebookAuthCallback(req, res) {
    
        let profileData = await Axios.get(
            Config.facebokUserInfoUrl,
            { headers: { 'Authorization': "Bearer " + req.query.access_token } }
        );

        let user_email: string = profileData.data.email;
        let user_token: string = req.query.access_token;
        let userName: string = profileData.data.name;

        let user: typeof UserModel = await UserModel.findOne({ email: user_email });

        if (user === null) {
            user = new UserModel({
                email: user_email,
                token: user_token,
                name: userName,
                isAdmin: false,
                location: req.location
            });
            await user.save();
        } else {
            user.token = user_token;
            user.location = req.location;
            await user.save();
        }
        res.end(JSON.stringify(user_token));
    }


}