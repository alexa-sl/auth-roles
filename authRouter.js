const Router = require('express');
const router = new Router();
const controller = require('./authController');
const {check} = require('express-validator');
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');

router.post('/registration',
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль не может быть пустым').notEmpty(),
    check('password', 'Пароль должен содержать от 4 до 10 символов').isLength({min: 4, max: 10}),
    controller.registration);
router.post('/login',
    check('username', 'Имя пользователя не может быть пустым').notEmpty(),
    check('password', 'Пароль не может быть пустым').notEmpty(),
    check('password', 'Пароль должен содержать от 4 до 10 символов').isLength({min: 4, max: 10}),
    controller.login);
router.post('/logout', controller.logout);
router.post('/refresh', controller.refresh);
router.get('/users', controller.getUsers);
// router.get('/users', authMiddleware, roleMiddleware(['ADMIN']), controller.getUsers);

module.exports = router;