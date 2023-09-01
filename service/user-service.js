const userModel = require('../models/User');
const bcrypt = require('bcryptjs');
const tokenService = require('../service/token-service');
const ApiError = require('../exeptions/api-error');
const UserDto = require('../dtos/user-dto');

class UserService {
    async login(username, password) {
        const user = await userModel.findOne({username});
        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден');
        }

        const isPassEqual =await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            throw ApiError.BadRequest('Неверный пароль');
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        return {...tokens, user: userDto};
    };
    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    };

    async refresh(refreshToken) {
        console.log('refreshToken on refresh', refreshToken);
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDB) {
            throw ApiError.UnauthorizedError();
        }

        const user = await userModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        return {...tokens, user: userDto};
    }
}

module.exports = new UserService();