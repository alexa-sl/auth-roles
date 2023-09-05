const jwt = require('jsonwebtoken');
const tokenModel = require('../models/Token');
class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '24h'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});

        return {
            accessToken,
            refreshToken
        }
    };

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (e) {
            return null;
        }
    };
    validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch (e) {
            return null;
        }
    };

    async saveToken(userId, refreshToken, roles) {
        const tokenData = await tokenModel.findOne({user: userId});

        if (tokenData) {
            tokenData.refreshToken = refreshToken;

            return tokenData.save();
        }

        return tokenModel.create({user: userId, roles: roles, refreshToken: refreshToken});
    };

    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne({refreshToken});
        return tokenData;
    };

    async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne({refreshToken});
        return tokenData;
    }
}

module.exports = new TokenService();