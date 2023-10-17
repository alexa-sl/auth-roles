require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const {MongoClient} = require('mongodb');
const mongoose = require('mongoose').default;
const authRouter = require('./authRouter');
const orderRouter = require('./orderRouter');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 5000;
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: process.env.FRONTEND_URL ?? "http://localhost:4200",
        // origin: "http://localhost:4200",
        optionsSuccessStatus: 200,
    })
);
// app.use(function (req, res, next) {
//     //Enabling CORS
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
//     next();
// });
app.all("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

app.use(express.json());
app.use('/auth', authRouter);
app.use('/orders', orderRouter);
app.use(errorMiddleware);

// const client = new MongoClient('mongodb://127.0.0.1:27017/rusprom');

const start = async () => {
    try {
        // client.connect()
        mongoose.connect('mongodb://127.0.0.1:27017/rusprom')
            .then(() => console.log('Connected Successfully'))
            .catch(error => console.log('Failed to connect', error))
        app.listen(PORT, () => {
            console.log(`server started on port ${PORT}`);
        })
    } catch (e) {
        console.log(e);
    }
}

start();