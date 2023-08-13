const Order = require('..\\models\\order')
const User = require('..\\models\\user')
const Coupon = require('..\\models\\coupon')
const asyncHandler = require('express-async-handler')

const createOrder = asyncHandler(async(req, res) => {
    const {_id} = req.user
    const {couponId} = req.body
    const userCart = await User.findById(_id).select('cart')
        .populate('cart.product', 'title price')
    const products = userCart?.cart?.map(element => ({
        product: element.product._id,
        title: element.product.title,
        count: element.quantity,
        color: element.color,
        price: element.product.price,
        sumPrice: element.quantity*element.product.price,
    }))   
    let totalPrices = userCart?.cart?.reduce((sum, element) => element.product.price * element.quantity + sum,0)

    const data = {products, totalPrices, priceAfterCoupon: totalPrices, coupon: couponId, discount: 0, orderBy: _id}

    if (couponId) {
        const selectedCoupon = await Coupon.findById(couponId)
        data.discount = -totalPrices* (+selectedCoupon.discount/100)
        totalPrices = Math.round(totalPrices * (1 - +selectedCoupon.discount/100)/1000)*1000
        data.priceAfterCoupon = totalPrices
    } 
    const result = await Order.create(data)
    return res.json({
        success: result ? true : false,
        createdCart: result ? result : 'Cannot create order',
        
    })
})


const updateStatusOrder = asyncHandler(async(req, res) => {
    const {orderId} = req.params
    const {status} = req.body 
    if (!status) throw new Error('Missing status order')
    const response = await Order.findByIdAndUpdate(orderId, {status}, {new: true})
    
    return res.json({
        success: response ? true : false,
        res: response ? response : 'Cannot update status order',
    })
})


const getUserOrder = asyncHandler(async(req, res) => {
    const {_id} = req.user
    const response = await Order.findOne({ orderBy: _id})
    return res.json({
        success: response ? true : false,
        res: response ? response : 'Cannot get order',
    })
})


const getALlOrderAdmin = asyncHandler(async(req, res) => {
    const response = await Order.find()
    
    return res.json({
        success: response ? true : false,
        res: response ? response : 'Cannot get all order',
        // userCart
    })
})

module.exports = {
    createOrder,
    updateStatusOrder,
    getUserOrder,
    getALlOrderAdmin
}