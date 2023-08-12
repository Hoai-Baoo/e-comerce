const Coupon = require('..\\models\\coupon')
const asyncHandler = require('express-async-handler')
// const slugify = require('slugify')

const createCoupon = asyncHandler(async(req, res) => {
    const {name, discount, expire} = req.body
    if (!name || !discount || !expire) throw new Error('Missing inputs')
    const response = await Coupon.create({
        ...req.body,
        expire: Date.now() + +expire*24*60*60*1000
    })
    return res.json({
        success: response ? true : false,
        createdCoupon: response ? response : 'Cannot create new Coupon'
    })
})

const getAllCoupons = asyncHandler(async(req, res) => {
    const response = await Coupon.find().select('-updatedAt -createdAt')
    return res.json({
        success: response ? true : false,
        allCoupons: response ? response : 'Cannot get all Coupons'
    })
})

const updateCoupon = asyncHandler(async(req, res) => {
    console.log(req.body)
    const {couponId} = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
    if (req.body.expire) req.body.expire = Date.now() + +req.body.expire*24*60*60*1000
    
    const response = await Coupon.findByIdAndUpdate(couponId, req.body, {new: true})
    console.log(response)
    return res.json({
        success: response ? true : false,
        updatedCoupon: response ? response : 'Cannot update the Coupon'
    })
})

const deleteCoupon = asyncHandler(async(req, res) => {
    const {couponId} = req.params
    const response = await Coupon.findByIdAndDelete(couponId)
    return res.json({
        success: response ? true : false,
        deletedCoupon: response ? response : 'Cannot delete the Coupon'
    })
})



module.exports = {
    createCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon,
}
