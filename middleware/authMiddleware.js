const jwt = require('jsonwebtoken');
const {secret} = require('../config');

module.exports = function(req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(token)
        if (!token) {
            res.status(401).json({message: 'Пользователь не авторизован'});
        }

        req.user = jwt.verify(token, secret);
        next();

    } catch (e) {
        console.log(e);
        res.status(401).json({message: 'Пользователь не авторизован', e});
    }
}