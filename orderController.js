const {validationResult} = require("express-validator");
const Order = require('./models/Order');

class orderController {
    async registerOrder(req, res, next){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).send({
                    errors: {errors: [{"msg": "Ошибка валидации данных"}]}
                });
            }

            const {clientName, clientPhone, clientOrderDate} = req.body;
            const order = await Order.create({
                clientName,
                clientPhone,
                clientOrderDate
            });

            // res.writeHead(200, {'Content-Type': 'text/html'});
            return res.json(order);
        } catch (e) {
            next(e);
        }
    };

    async getOrders(req, res, next){
        try {
            const orders = await Order.find();
            res.json(orders);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new orderController();