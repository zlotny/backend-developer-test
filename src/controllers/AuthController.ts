import { Config } from "config/Configuration";
import Axios from "axios";
import User from "models/User";
import Express = require('express');

const UserModel: any = new User().getModelForClass(User);

export default class AuthController {

    /**
     * Receives the response from a Google OAuth2 authentication try. If all went well,
     * tries to get the user info and inject it on a new user if the mail is not registered.
     * 
     * If the mail is already registered this acts as a login attempt, refreshing the token.
     * 
     * @param  {any} req - Request sent to the server
     * @param  {Express.Response} res - Response from the server
     * @returns Promise
     */
    public static async googleAuthCallback(req: any, res: Express.Response): Promise<void> {
        let profileData: any = await Axios.get(
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

    /**
     * Receives the response from a Facebook OAuth2 authentication try. If all went well,
     * tries to get the user info and inject it on a new user if the mail is not registered.
     * 
     * If the mail is already registered this acts as a login attempt, refreshing the token.
     * 
     * @param  {any} req - Request sent to the server
     * @param  {Express.Response} res - Response from the server
     * @returns Promise
     */
    public static async facebookAuthCallback(req: any, res: Express.Response): Promise<void> {
        let profileData: any = await Axios.get(
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