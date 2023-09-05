const {Schema, model} = require('mongoose');

const Order = new Schema({
    clientName: {type: String},
    clientPhone: {type: String, required: true}
});

module.exports = model('Order', Order);