import { Config } from 'config/Configuration';
import AuthController from 'controllers/AuthController';
import LocationMiddleware from 'middleware/Location';
import { BaseRouter } from "routes/BaseRouter";
import { WebRouter } from "routes/WebRouter";
import Log from 'utils/Log';
import mongoose = require('mongoose');
import express = require('express');
import Grant = require('grant-express');
import session = require('express-session');
import exphbs = require('express-handlebars');
import path = require('path');
import swaggerUi = require('swagger-ui-express');
import swaggerDocument = require('../swagger.json');
import DatabaseSeeder from 'config/DatabaseSeeder';

const app = express();

// Support for handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// External service auth middleware
app.use(session(Config.sessionConfig));
app.use(new Grant(Config.grant));

// Google authorization callback
app.get('/google_callback', LocationMiddleware.injectLocation, AuthController.googleAuthCallback);
app.get('/facebook_callback', LocationMiddleware.injectLocation, AuthController.facebookAuthCallback);

// API router and docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', BaseRouter);

// Web router
app.use('/', express.static(path.join(__dirname, '../public')))
app.use('/', WebRouter);

mongoose.set('useCreateIndex', true);
mongoose.connect(Config.mongodbDatabase, { useNewUrlParser: true, }, DatabaseSeeder.handler);

app.listen(Config.port, () => {
    Log.Instance.info(`Server started at port ${Config.port}`);
});