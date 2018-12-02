import { Router, Request, Response } from 'express';
import { requiresAuth } from 'middleware/Auth';
import { UsersRouter } from './UsersRouter';
import { GamesRouter } from './GamesRouter';
import User from 'models/User';
import bodyParser = require('body-parser');
import session = require('express-session');
import Grant = require('grant-express');
import bearerToken = require('express-bearer-token');
import { Config } from 'config/Configuration';

const UserModel: any = new User().getModelForClass(User);

const grantMiddleware: any = new Grant(Config.grant);
const router: Router = Router();

// Middlewares for this router
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(session(Config.sessionConfig));
router.use(grantMiddleware);
router.use(bearerToken())

// Google authorization callback
router.get('/google_callback', async (req: Request, res: Response): Promise<void> => {
    let user_email: string = req.query.id_token.payload.email;
    let user_token: string = req.query.access_token;

    let user: typeof UserModel = await UserModel.findOne({ email: user_email });

    // TODO: Find name and maybe location with google
    if (user === null) {
        user = new UserModel({
            email: user_email,
            token: user_token,
            name: "Fixme"
        });
        await user.save();
    } else {
        user.token = user_token;
        await user.save();
    }
    res.end(JSON.stringify(user_token));
});

// TODO: Needs completion
router.use('/api/users', requiresAuth, UsersRouter);
router.use('/api/games', requiresAuth, GamesRouter);

export const BaseRouter: Router = router;