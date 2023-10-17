const Router = require('express');
const router = new Router();
const controller = require('./orderController');
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');
const {check} = require('express-validator');

router.post('/registerOrder',
    check('clientPhone', 'Телефон должен содержать до 14 символов').isLength({min: 6, max: 14}),
    controller.registerOrder);
router.get('/getOrders', authMiddleware, roleMiddleware(['ADMIN']), controller.getOrders);
// router.get('/getOrders', controller.getOrders);

module.exports = router;