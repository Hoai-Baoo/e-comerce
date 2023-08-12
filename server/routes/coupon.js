const router = require('express').Router()
const ctrls = require('..\\controllers\\coupon')
const {verifyAcessToken, isAdmin} = require('..\\middlewares\\verifyToken')

router.post('/', [verifyAcessToken, isAdmin], ctrls.createCoupon)
router.get('/',  ctrls.getAllCoupons)
router.put('/:couponId', [verifyAcessToken, isAdmin], ctrls.updateCoupon)
router.delete('/:couponId', [verifyAcessToken, isAdmin], ctrls.deleteCoupon)

module.exports = router


// CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE