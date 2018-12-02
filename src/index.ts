import { BaseRouter } from "routes/BaseRouter";
import { Config } from 'config/Configuration';
import mongoose = require('mongoose');
import express = require('express');

const app = express();

app.use('/', BaseRouter);

mongoose.connect(Config.mongodbDatabase, {
    useNewUrlParser: true,
});

app.listen(Config.port, () => {
    console.log(`Server started at port ${Config.port}`);
});