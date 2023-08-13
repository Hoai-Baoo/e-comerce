const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products:[{
        product: {type: mongoose.Types.ObjectId, ref: 'Product'},
        title: String,
        count: Number,
        color: String,
        price: Number,
        sumPrice: Number,
    }],
    status:{
        type:String,
        default: 'Processing',
        enum: ['Cancelled','Processing','Successed']
    },
    totalPrices: Number,
    priceAfterCoupon: Number,
    coupon: {
        type: mongoose.Types.ObjectId,
        ref: 'Coupon'
    },
    discount: Number,
    orderBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
    },
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);