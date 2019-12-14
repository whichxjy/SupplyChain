const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/conf');
const route = require('./router/route');
const cors = require('cors')

const app = express();

mongoose.connect(config.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

mongoose.connection.catch(err => console.log(err));

mongoose.connection.once('open', () => {
    console.log('Connect to db');
});

app.use(cors());
app.use(express.json());

app.use('/', route);

app.listen(config.APP_PORT);

module.exports = app;