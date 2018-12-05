import { Request, Response } from 'express';
import { BaseRouter } from "routes/BaseRouter";
import { Config } from 'config/Configuration';
import mongoose = require('mongoose');
import express = require('express');
import Grant = require('grant-express');
import session = require('express-session');
import User from 'models/User';

const app = express();
const UserModel: any = new User().getModelForClass(User);

// External service auth middleware
app.use(session(Config.sessionConfig));
const grantMiddleware: any = new Grant(Config.grant);
app.use(grantMiddleware);

// Google authorization callback
app.get('/google_callback', async (req: Request, res: Response): Promise<void> => {
    let user_email: string = req.query.id_token.payload.email;
    let user_token: string = req.query.access_token;

    let user: typeof UserModel = await UserModel.findOne({ email: user_email });

    // TODO: Find name and maybe location with google
    if (user === null) {
        user = new UserModel({
            email: user_email,
            token: user_token,
            name: "Fixme",
            location: [26.7747074, -71.1144237]
        });
        await user.save();
    } else {
        user.token = user_token;
        await user.save();
    }
    res.end(JSON.stringify(user_token));
});

// API router
app.use('/api', BaseRouter);

mongoose.connect(Config.mongodbDatabase, {
    useNewUrlParser: true,
});

app.listen(Config.port, () => {
    console.log(`Server started at port ${Config.port}`);
});