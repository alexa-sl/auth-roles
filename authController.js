const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const tokenService = require('./service/token-service');
const UserDto = require('./dtos/user-dto');
const userService = require('./service/user-service');
// const ApiErrors = require('./exeptions/api-error');

class authController {
    async registration (req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).send({
                    errors
                });
                // return next(ApiErrors.BadRequest('Ошибка валидации', errors.array()));
            }

            const {username, password} = req.body;
            const candidate = await User.findOne({username});

            if (candidate) {
                res.status(400).send({
                    errors: {errors: [{"msg": "Пользователь с таким именем уже существует"}]}
                });
            }

            const salt = bcrypt.genSaltSync(7);
            const hashPass = bcrypt.hashSync(password, salt);
            const userRole = await Role.findOne({value: 'USER'});
            // await Role.create({value: 'USER'});
            // await Role.create({value: 'ADMIN'});
            const user = new User({
                username,
                password: hashPass,
                roles: [userRole.value]
            });

            const userDto = new UserDto(user); // username; _id; roles
            const tokens = tokenService.generateTokens({...userDto});

            await tokenService.saveToken(userDto.id, tokens.refreshToken, userDto.roles);
            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});

            user.save();
            return res.status(200).json({
                message: 'CREATED!!!',
                ...tokens,
                user: userDto
            });
        } catch (e) {
            next(e);
        }
    }
    async login (req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).send({
                    errors
                });
                // return next(ApiErrors.BadRequest('Ошибка валидации', errors.array()));
            }
            const {username, password} = req.body;
            const userData = await userService.login(username, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});

            return res.send(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    };

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
            return res.json(userData);
        }   catch (e) {
            next(e);
        }
    };

    async getUsers (req, res, next) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new authController();