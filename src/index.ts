import { BaseRouter } from "routes/BaseRouter";
import { Config } from 'config/Configuration';
import mongoose = require('mongoose');
import express = require('express');
import Grant = require('grant-express');
import session = require('express-session');
import { injectLocation } from 'middleware/Location';
import AuthController from 'controllers/AuthController';

const app = express();

// External service auth middleware
app.use(session(Config.sessionConfig));
app.use(new Grant(Config.grant));

// Google authorization callback
app.get('/google_callback', injectLocation, AuthController.googleAuthCallback);
app.get('/facebook_callback', injectLocation, AuthController.facebookAuthCallback);

// API router
app.use('/api', BaseRouter);

mongoose.connect(Config.mongodbDatabase, {
    useNewUrlParser: true,
});

app.listen(Config.port, () => {
    console.log(`Server started at port ${Config.port}`);
});