const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/conf');
const route = require('./router/route');
const cors = require('cors')

const app = express();

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

mongoose.connect(config.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

mongoose.connection.catch(err => console.log(err));

mongoose.connection.once('open', () => {
    console.log('Connect to db');
});

//enable cors
app.use(cors());
app.use(express.json());

app.use('/', route);

app.listen(config.APP_PORT);

module.exports = app;