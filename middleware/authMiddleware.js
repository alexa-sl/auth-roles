const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }

    try {
        if (!req.headers ||  !req.headers.authorization ) {
            res.status(401).json({message: 'no headers'});
        }

        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            res.status(401).json({message: 'Пользователь не авторизован'});
        }

        req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        next();

    } catch (e) {
        console.log(e);
        res.status(401).json({message: 'Пользователь не авторизован', e});
    }
}