const Router = require('express');
const router = new Router();
const controller = require('./authController');
const {check} = require('express-validator');
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');

router.post('/registration',
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен содержать от 4 до 10 символов').notEmpty().isLength({min: 4, max: 10}),
    controller.registration);
router.post('/login', controller.login);
router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers);

module.exports = router;