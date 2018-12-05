import { Config } from 'config/Configuration';
import AuthController from 'controllers/AuthController';
import { injectLocation } from 'middleware/Location';
import { BaseRouter } from "routes/BaseRouter";
import { WebRouter } from "routes/WebRouter";
import mongoose = require('mongoose');
import express = require('express');
import Grant = require('grant-express');
import session = require('express-session');
import exphbs = require('express-handlebars');
import path = require('path');
import Log from 'utils/Log';
const { createLogger, format, transports } = require('winston');

const app = express();

// Winston logger
const logger = createLogger({
    level: 'info',
    format: format.simple(),
    // You can also comment out the line above and uncomment the line below for JSON format
    // format: format.json(),
    transports: [new transports.Console()]
});

// Support for handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// External service auth middleware
app.use(session(Config.sessionConfig));
app.use(new Grant(Config.grant));

// Google authorization callback
app.get('/google_callback', injectLocation, AuthController.googleAuthCallback);
app.get('/facebook_callback', injectLocation, AuthController.facebookAuthCallback);

// Web router
app.use('/', express.static(path.join(__dirname, '../public')))
app.use('/', WebRouter);

// API router
app.use('/api', BaseRouter);

mongoose.set('useCreateIndex', true);
mongoose.connect(Config.mongodbDatabase, {
    useNewUrlParser: true,
});

app.listen(Config.port, () => {
    Log.Instance.info(`Server started at port ${Config.port}`);
});