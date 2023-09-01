require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRouter = require('./authRouter');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 5000;
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: process.env.FRONTEND_URL ?? "http://localhost:4200",
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

app.use(express.json());
app.use('/auth', authRouter);
app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://alexa_sl:Alfa12_07@cluster0.xm8qrez.mongodb.net/?retryWrites=true&w=majority',
            {useNewUrlParser: true, UseUnifiedTopology: true});
        app.listen(PORT, () => {
            console.log(`server started on port ${PORT}`);
        })
    } catch (e) {
        console.log(e);
    }
}

start();