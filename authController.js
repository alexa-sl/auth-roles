const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const {secret} = require('./config');

const generateAccessToken = (id, roles) => {
    const payload = {
      id,
      roles
    };

    return jwt.sign(payload, secret, {expiresIn: '24h'});
};
class authController {
    async registration (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: 'Ошибка валидации', errors});
            }

            const {username, password} = req.body;
            const candidate = await User.findOne({username});

            if (candidate) {
                res.status(400).json({message: 'Пользователь с таким именем уже существует'});
            }

            const salt = bcrypt.genSaltSync(7);
            const hashPass = bcrypt.hashSync(password, salt);
            const userRole = await Role.findOne({value: 'USER'});
            const user = new User({
                username,
                password: hashPass,
                roles: [userRole.value]
            });

            await user.save();
            return res.json({message: 'Пользователь создан!'});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Registration error!'});
        }
    }
    async login (req, res) {
        try {
            const {username, password} = req.body;
            const user = await User.findOne({username});

            if (!user) {
                return res.status(404).json({message: `Пользователь ${username} не найден`});
            }

            const validPassword = bcrypt.compareSync(password, user.password);

            if (!validPassword) {
                return res.status(401).json({message: 'Неверный пароль'});
            }

            const token = generateAccessToken(user._id, user.roles);

            return res.json({'token': token});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Login error!'});
        }
    }
    async getUsers (req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new authController();