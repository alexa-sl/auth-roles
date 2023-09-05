const ApiError = require('../exeptions/api-error');

module.exports = function (err, req, res, next) {
    console.log(err);

    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, errors: {errors: [{msg: err.message}]}});
    }

    return res.status(500).json({message: 'Непредвиденная ошибка'});
}